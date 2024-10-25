import { LLMPrompts } from "app/_components/ModelPersonalized";
import { set } from "react-hook-form";

export type ModelType = "ChatGPT" | "Personalized";

export interface ChatGPTConfig {
    name: "ChatGPT";
    api_key: string;
}

export interface PersonalizedConfig {
    name: "Personalized";
    host: string;
    port: string;
    api_key: string;
    selectedModel?: string;
    models?: string[];
}
export interface ConfigPrompt {
    summary: string,
    bullet_points: string,
    topic_name: string,
}

export interface Configuration {
    model: ChatGPTConfig | PersonalizedConfig;
    prompts: Record<string, ConfigPrompt>;
    article_summary_length: number;
    max_bullet_points: number;
    model_iteration_persistence_days: number;
    spider_interval_seconds: number;
}

interface instanceOfReturn {
    status: boolean,
    missing: string[]
}

interface LLMCapabilities {
    endpoints: {
        generate: [
            "prompt",
            "max_tokens"
        ]
    }
}

export interface instanceOfLLMCapabilitiesReturn {status: boolean, missing: string[], message?: string, body: object}

export function instanceOfLLMCapabilities(object: any): instanceOfLLMCapabilitiesReturn {
    let ret: instanceOfLLMCapabilitiesReturn = { status: true, missing: [], body: {...object} }

    if (!object.hasOwnProperty("endpoints")) {
        ret.status = false;
        ret.missing.push("endpoints")
    } else {
        if (!object.endpoints.hasOwnProperty("generate")) {
            ret.status = false;
            ret.missing.push("endpoints.generate")
        } else {
            const missing = Array.from(["prompt", "max_tokens"])
            .filter((v) => !object.endpoints.generate.includes(v))
            if (missing.length > 0) {
                ret.status = false;
                missing.forEach((v) => ret.missing.push(`endpoints.generate.${v}`));
            }
        }
    }

    if (!object.hasOwnProperty('models')) {
        ret.status=false;
        ret.missing.push("models")
    }
    return ret
}

export interface ModelPersonalizedProps {
    selected: string,
    setSelected: (value: ModelType) => void,
    serverValid: boolean, 
    setServerValid: (value: boolean) => void,
    host?: string,
    setHost?: (host: string) => void,
    port?: string,
    setPort?: (port: string) => void,
    APIKey?: string,
    setAPIKey?: (APIKey: string) => void,
    selectedModel?: string | null,
    setSelectedModel?: (v: string) => void,
    availableModels?: string[] | null,
    setAvailableModels?: (v: string[]) => void,
    defaultPrompts: LLMPrompts,
}

export interface ModelChatGPTProps {
    selected: string,
    setSelected: (value: ModelType) => void,
    APIKey?: string,
    setAPIKey?: (gptApiKey: string) => void,
    serverValid: boolean, 
    setServerValid: (value: boolean) => void,
    defaultPrompts: LLMPrompts,
}

export interface DataModelPromptsProps {
    modelType: ModelType,
    host?: string,
    port?: string,
    api_key?: string,
    modelName: string,
    summaryPrompt: string,
    setSummaryPrompt: (v:string)=>void,
    bulletPointsPrompt: string,
    setBulletPointsPrompt: (v:string)=>void,
    topicNamePrompt: string,
    setTopicNamePrompt: (v:string)=>void,
    defaultPrompts: LLMPrompts,
}


export interface DataModelProps {
    dataModelPersonalized: ModelPersonalizedProps,
    dataModelChatGPT: ModelChatGPTProps,
    dataModelPrompts: DataModelPromptsProps,
}


export interface BackEndProps {
    articleSummaryLength: string,
    setArticleSummaryLength: (value: string) => void,
    spiderIntervalSeconds: string,
    setSpiderIntervalSeconds: (value: string) => void,
    modelIterationPersistanceDays: string,
    setModelIterationPersistanceDays: (value: string) => void,
    maxBulletPoints: string,
    setMaxBulletPoints: (value: string) => void,
}


export interface FrontEndProps {

}

export interface validateLLMServerProps {
    host: string,
    port: number,
    api_key?: string
}

// export interface testLLMServerProps extends validateLLMServerProps {
//     model_type: string,
//     question: string,
// }