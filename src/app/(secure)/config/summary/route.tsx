'use server'

import { NextResponse } from "next/server";
import { ArticleSummaryProps, buildLLMServerConfig } from "../validateServer";
import axios from "axios";
import getConfig from 'next/config'

const publicRuntimeConfig = getConfig()?.publicRuntimeConfig || {}
const defaultTimeout = publicRuntimeConfig.defaultTimeout || 120;

const encoder = new TextEncoder();


async function* fetchSummaryResponse ({host, port, prompt, model_type, articles, max_tokens, timeout, api_key}: ArticleSummaryProps) { 
    
    const options = await buildLLMServerConfig({host: host, port: port, api_key: api_key, timeout : timeout || defaultTimeout})
    
    const response = axios.post(
        host + ":" + port + "/llm/article_summary",
        {
            'prompt': prompt,
            'model_type': model_type,
            'articles': articles,
            'max_tokens': max_tokens || 512,
        },
        options
    )
    console.log('sending status')
    
    yield {type: 'message', status: 'waiting', message: 'Request sent. Waiting for response...'}
    console.log('sent status')
    
    try {
        const result = await response
    
        console.log('result', result)
        if (result.status === 200) {
            yield {type: 'response', status: 'success', message: result.data[0]}
        }
        else {
            yield {type: 'response', status: 'failed', message: result.data}
        }
    } catch (error) {
        console.log('error', error)
        yield {type: 'response', status: 'failed', message: error}
    }
    
}

export const makeStream = (generator:any) => {
    return new ReadableStream<any>({
        async pull(controller) {
            const { value, done } = await generator.next()
            console.log('pull', value, done)
            if (done) {
                controller.close();
            } else {
                const chunkData = encoder.encode(JSON.stringify(value));
                console.log('chunkData', chunkData)
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


// type Item = {
//     key: string;
//     value: string;
// }

/**
 * async generator that simulate a data fetch from external resource and
 * return chunck of data every second
 */
// const sleep = (ms: number) =>
//     (new Promise(resolve => setTimeout(resolve, ms)))

// async function* fetchItems() {

    

//     for (let i = 0; i < 3; ++i) {
//         await sleep(65000)
//         const data = {
//             key: `key${i}`,
//             value: `value${i}`
//         }
//         console.log('fetchItems', data)
//         yield data
//         // yield encoder.encode(await JSON.stringify(data)) 

//         // yield encoder.encode('test')
//     }
// }

/**
 * Next.js Route Handler that returns a Response object 
 * that stream data from the async generator.
 * 
 */
export async function POST(request: Request) {
    const body = await request.json()
    console.log('body', body)
    const iterator = fetchSummaryResponse({...body})
    console.log('iterator', iterator)
    const stream = makeStream(iterator)
    return new Response(await stream)
    // const stream = makeStream( fetchSummaryResponse() )
    // const response = new StreamingResponse( await stream )
    // return response


    // const iterator = fetchItems()
    // console.log(makeStream)
    // const stream = await makeStream(iterator)
    // // const response = new StreamingResponse(stream)
    // // console.log('returning response', response)
    // // return response
    // return new StreamingResponse(stream)
}

