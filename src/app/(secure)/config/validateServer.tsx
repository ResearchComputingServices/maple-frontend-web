'use server'

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Configuration, instanceOfLLMCapabilities, instanceOfLLMCapabilitiesReturn, testLLMServerProps, validateLLMServerProps } from "app/_types/config.d";
import https from "https";


export async function testLLMServer({ host, port, api_key, model_type, question }: testLLMServerProps) : Promise<AxiosResponse> {
    let options: AxiosRequestConfig = {
        timeout: 60000,
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
