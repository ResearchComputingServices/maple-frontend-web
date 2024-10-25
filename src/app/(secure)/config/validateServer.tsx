'use server'

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Configuration, instanceOfLLMCapabilities, instanceOfLLMCapabilitiesReturn, validateLLMServerProps } from "app/_types/config.d";
import https from "https";
import getConfig from 'next/config'

const publicRuntimeConfig = getConfig()?.publicRuntimeConfig || {}
const defaultTimeout = publicRuntimeConfig.defaultTimeout || 120000;

interface buildLLMServerConfigProps {
    host: string,
    port: string,
    api_key?: string,
    timeout?: number,
}

export async function buildLLMServerConfig({
    host, port, api_key, timeout, }: buildLLMServerConfigProps): Promise<AxiosRequestConfig> {
    
    let options: AxiosRequestConfig = {
        timeout: timeout || defaultTimeout,
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        }),
    }
    if (api_key) {
        options.headers = {
            ...options.headers,
            'x-api-key': `${api_key}`,
        }
    }
    console.log('build options', options)   
    return options
}

interface testLLMServerProps extends buildLLMServerConfigProps {
    model_type: string,
    question: string,
}

interface ArticleProps extends buildLLMServerConfigProps {
    articles: string[],
    model_type: string,
    prompt: string,
}

export interface ArticleSummaryProps extends ArticleProps {
    max_tokens?: number,
}

export interface TopicNameProps extends Omit<ArticleProps, 'articles'> {
    keywords: string[],
    max_tokens?: number,
}

// export async function LLMServerArticleSummary({host, port, api_key, timeout, articles, model_type, prompt, max_tokens}: ArticleSummaryProps){
//     let options = await buildLLMServerConfig({host: host, port: port, api_key: api_key, timeout : timeout || defaultTimeout})
//     console.log("options", options)
//     // options.responseType = 'stream'
//     return await axios.post(
//         // host + ":" + port + "/llm/article_summary",
//         '/config/summary',
//         {
//             host: host,
//             port: port,
//             api_key: api_key,
//             prompt: prompt,
//             model_type: model_type,
//             articles: articles,
//             max_tokens: max_tokens || 512,
//         },
//         options = options,
//     )
//         .then((response) => {
//             // const stream = response.data
//             // stream.on('data', data => {console.log(data)});
//             // stream.on('end', () => {console.log('end')});
//             // response.data.pipe(response.data)
//             console.log(response)
//             return response.data
//         })
//         .catch((error) => {
//             console.log("error in request.", error)
//             return [`Could not retrieve the article summary.\n${error}`]
//         })

// }

// export class StreamingResponse extends Response {
//     constructor(res: ReadableStream<any>, init?: ResponseInit) {
//         super(res as any, {
//             ...init,
//             status: 200,
//             headers: {
//                 ...init?.headers,
//             }
//         });
//     }
// }

interface ReadableStreamResponse {
    status?: 'failed' | 'success' | 'waiting',
    type: 'response' | 'message',
    message: string,
}

// export async function LLMServerArticleSummaryStream({host, port, api_key, timeout, articles, model_type, prompt, max_tokens}: ArticleSummaryProps){
    
//     // let options = buildLLMServerConfig({host: host, port: port, api_key: api_key, timeout: timeout || defaultTimeout})

//     try {
        

//         const iterator = fetchSummaryResponse({host, port, api_key, timeout, articles, model_type, prompt, max_tokens})
//         console.log('iterator', iterator)
//         const stream = new ReadableStream({
//             async pull(controller) {
//                 const encoder = new TextEncoder();
//                 const {value, done} = await iterator.next()
//                 if (done) {controller.close()}
//                 else {
//                     console.log('pull', value)
//                     const encoded = encoder.encode(JSON.stringify(value));
//                     controller.enqueue(encoded);
//                     console.log('sent encoded')
//                 }
//             }
//         })
//         console.log('stream', stream)   
//         return new Response(await stream)

//     } catch (error) {
//         console.log("Error in request.", error);
//         return [`Could not retrieve the article summary stream.\n${error}`];
//     }
// }


export async function LLMServerBulletPoint({host, port, api_key, timeout, articles, model_type, prompt, max_tokens}: ArticleSummaryProps){
    let options = buildLLMServerConfig({host: host, port: port, api_key: api_key, timeout : timeout || defaultTimeout})
    return axios.post(
        host + ":" + port + "/llm/bullet_point",
        {
            'prompt': prompt,
            'model_type': model_type,
            'articles': articles,
            'max_tokens': max_tokens || 512,
        },
        options = options)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            console.log("error in request.", error)
            return [`Could not retrieve the bullet point summaries.\n${error}`]
        })

}

export async function LLMServerTopicName({host, port, api_key, timeout, keywords, model_type, prompt, max_tokens}: TopicNameProps){
    let options = buildLLMServerConfig({host: host, port: port, api_key: api_key, timeout : timeout || defaultTimeout})
    return axios.post(
        host + ":" + port + "/llm/topic_name",
        {
            'prompt': prompt,
            'model_type': model_type,
            'keywords': keywords,
            'max_tokens': max_tokens || 512,
        },
        options = options)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            console.log("error in request.", error)
            return [`Could not retrieve the topic name.\n${error}`]
        })

}

export async function testLLMServer({ host, port, api_key, timeout, model_type, question }: testLLMServerProps): Promise<AxiosResponse> {
    let options = buildLLMServerConfig({ host: host, port: String(port), api_key: api_key, timeout: timeout || defaultTimeout })
    
    return axios.post(
        host + ":" + port + "/llm/generate",
        {
            'prompt': [question],
            'model_type': model_type,
            'max_tokens': 512
        },
        options = options)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            console.log("error in request.", error)
            return ['error']
        })
}


export async function validateLLMServer({ host, port, api_key }: validateLLMServerProps): Promise<instanceOfLLMCapabilitiesReturn> {

    let options: AxiosRequestConfig = {
        timeout: 2000,
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        }),
    }

    if (api_key) {
        options.headers = {
            ...options.headers,
            'x-api-key': `${api_key}`,
        }
    }

    return axios.get(
        host + ":" + port + "/llm/capabilities",
        options = options
    )
        .then((response) => {
            console.log("got capabilities", response)
            return instanceOfLLMCapabilities(response.data)
        })
        .catch((error) => {
            console.error("Could not fetch config", error)
            let message = ""
            let body = {}
            if (error.code === "ECONNABORTED") {
                message = `Could not reach the specified server. Please, verify host and port and try again. (${error.code})`
            } else if (error.code === "ECONNREFUSED") {
                message = `Could reach the server, but it seems the port might be incorrect (${error.code})`
            } else if (error.code === "ERR_BAD_REQUEST") {
                message = "It is possible to reach the server, but it seems you are missing the right authorization. Check the api_key and contact the administrator if everything seems correct from your part."
                body = { status: error.response!.status! }
            }

            return {
                status: false,
                missing: [],
                message: message,
                body: body,
            }
        }
        )

}
