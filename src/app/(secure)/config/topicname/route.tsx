'use server'

import { NextResponse } from "next/server";
import { ArticleSummaryProps, buildLLMServerConfig, TopicNameProps } from "../validateServer";
import axios from "axios";
import getConfig from 'next/config'

const publicRuntimeConfig = getConfig()?.publicRuntimeConfig || {}
const defaultTimeout = publicRuntimeConfig.defaultTimeout || 120;

const encoder = new TextEncoder();


async function* fetchTopicNameResponse({ host, port, prompt, model_type, keywords, max_tokens, timeout, api_key }: TopicNameProps) {

    const options = await buildLLMServerConfig({ host: host, port: port, api_key: api_key, timeout: timeout || defaultTimeout })

    const response = axios.post(
        host + ":" + port + "/llm/topic_name",
        {
            'prompt': prompt,
            'model_type': model_type,
            'keywords': keywords,
            'max_tokens': max_tokens || 512,
        },
        options
    )

    yield { type: 'message', status: 'waiting', message: 'Request sent. Waiting for response...' }

    try {
        const result = await response

        if (result.status === 200) {
            yield { type: 'response', status: 'success', message: result.data }
        }
        else {
            yield { type: 'response', status: 'failed', message: result.data }
        }
    } catch (error) {
        yield { type: 'response', status: 'failed', message: error }
    }

}

export const makeStream = (generator: any) => {
    return new ReadableStream<any>({
        async pull(controller) {
            const { value, done } = await generator.next()
            if (done) {
                controller.close();
            } else {
                const chunkData = encoder.encode(JSON.stringify(value));
                controller.enqueue(chunkData);
            }
        }
    });
}

class StreamingResponse extends NextResponse {
    constructor(res: ReadableStream<any>, init?: ResponseInit) {
        super(res as any, {
            ...init,
            status: 200,
            headers: {
                ...init?.headers,
            },
        });
    }
}


/**
 * Next.js Route Handler that returns a Response object 
 * that stream data from the async generator.
 * 
 */
export async function POST(request: Request) {
    const body = await request.json()
    const iterator = fetchTopicNameResponse({ ...body })
    const stream = makeStream(iterator)
    return new Response(await stream)
}

