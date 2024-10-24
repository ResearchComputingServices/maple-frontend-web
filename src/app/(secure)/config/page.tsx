'use client';

import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form, Modal, Button, Container, Spinner } from "react-bootstrap";
import axios, {  } from "axios";
import { NavbarTop2 } from 'app/_components/navbars';
import { BackEndConfig, defaultLLMPrompts, LLMPrompts } from "app/_components/ModelPersonalized";
import DataModel from "app/_components/ModelPersonalized";
import { useRouter } from "next/navigation";
import { Configuration, ModelType } from "../../_types/config.d";

const baseApiUrl = process.env.PATH_URL_BACKEND_REMOTE;
const configEndpoint = "/config";


const Config = () => {
    const router = useRouter()
    const [loadingConfig, setLoadingConfig] = useState(true);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            event.stopPropagation();
            onButtonClickUpdateConfig();
        }
    }

    const [defaultPrompts, setDefaultPrompts] = useState(defaultLLMPrompts);
    const [modelTypeRadio, setModelTypeRadio] = useState<ModelType>("Personalized");
    
    // ChatGPT props
    const [gptApiKey, setGptApiKey] = useState("");

    // Personalized props
    const [serverValid, setServerValid] = React.useState<boolean>(false)
    const [personalizedHost, setPersonalizedHost] = useState("");
    const [personalizedPort, setPersonalizedPort] = useState("");
    const [personalizedApiKey, setPersonalizedApiKey] = useState("");
    const [personalizedSelectedModel, setPersonalizedSelectedModel] = useState<string | null>(null)
    const [personalizedAvailableModels, setPersonalizedAvailableModels] = useState<string[] | null>(null)
    const [modelName, setModelName] = useState<string>("");

    const [summaryPrompt, setSummaryPrompt] = useState('');
    const [summaryValidated, setSummaryValidated] = useState(false);
    const [bulletPointPrompt, setBulletPointPrompt] = useState('');
    const [topicNamePrompt, setTopicNamePrompt] = useState('');
    
    // Backend Config props
    const [summaryLen, setsummaryLen] = useState("");
    const [maxBulletPoint, setmaxBulletPoint] = useState("");
    const [spiderIntervalSeconds, setSpiderIntervalSeconds] = useState("");
    const [modelIterationPersistanceDays, setModelIterationPersistanceDays] = useState("");

    // ==== Post Config Details ====
    const onButtonClickUpdateConfig = async () => {

        const config = getConfig();

        if (config) {
            const address = `${baseApiUrl}${configEndpoint}`;
            try {
                const options = {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        "Accept": "application/json"
                    },
                    data: config,
                    url: address,
                };
                const resp = await axios(options);
                setConfig({config: {...resp.data}})
                // console.log("DEBUG Axios:", resp.data);

                setShowModalSubmit(true);
                setTimeout(() => {
                    setShowModalSubmit(false)
                    router.push('/config')
                }, 3000);
            } catch (err: any) {
                console.error("ERR Axios:", err);
                if (err.code! === "ERR_BAD_REQUEST") {
                    console.log("test")
                    setModalWarningChildren(<>
                     <h5>{err.message}</h5>
                     {err.response.data.message.map((v: string)=> <p>{v}</p>)}
                    </>)
                    setShowModalWarning(true)
                }
            }
        } else {
            console.log("ERROR: Sanity check failed");
        }
    };

    // ==== Modal Submit Status ====
    const [showModalSubmit, setShowModalSubmit] = useState(false);
    const ModalSubmitStatus = (props: any) => {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={()=>{
                    console.log('closing')
                    setShowModalSubmit(false)
                    router.push('/config')
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <h4 className="mb-1" id="billingAddressModalLabel">
                            Config Submit Status
                        </h4>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Request submitted successfully</p>
                </Modal.Body>
            </Modal>
        );
    };

    // ==== Modal Warning ====
    const [showModalWarning, setShowModalWarning] = useState(false);
    const [modalWarningChildren, setModalWarningChildren] = useState<React.ReactNode | null>(null);
    const ModalWarning = (props: any) => {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <h4 className="mb-1" id="billingAddressModalLabel">
                            Error Message
                        </h4>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalWarningChildren}
                </Modal.Body>
            </Modal>
        );
    };

    // Get configuration from current form.
    function getConfig() {
        let sendConfig: Configuration = {} as Configuration;
        if (modelTypeRadio == "ChatGPT") {
            sendConfig.model = {
                name: "ChatGPT",
                api_key: gptApiKey
            }
        } else if (modelTypeRadio == "Personalized") {
            sendConfig.model = {
                name: "Personalized",
                host: personalizedHost,
                port: personalizedPort,
                api_key: personalizedApiKey,
                selectedModel: personalizedSelectedModel ?? undefined,
                models: personalizedAvailableModels ?? undefined,
            }
        }
        sendConfig.prompts = {
            [modelName]: {
                summary: summaryPrompt,
                bullet_points: bulletPointPrompt,
                topic_name: topicNamePrompt,
            }
        }
        sendConfig.article_summary_length = parseInt(summaryLen, 10);
        sendConfig.max_bullet_points = parseInt(maxBulletPoint, 10);
        sendConfig.spider_interval_seconds = parseInt(spiderIntervalSeconds, 10);
        sendConfig.model_iteration_persistence_days = parseInt(modelIterationPersistanceDays, 10);

        return sendConfig;
    }

    // Set configuration from backend data.
    async function setConfig({ config }: { config: Configuration }) {
        setModelTypeRadio(config.model.name);
        if (config.model.name == "ChatGPT") {
            setGptApiKey(config.model.api_key)
        }
        if (config.model.name == "Personalized") {
            setPersonalizedApiKey(config.model.api_key);
            setPersonalizedHost(config.model.host);
            setPersonalizedPort(config.model.port);
            setPersonalizedAvailableModels(config.model.models ?? null)
            
            let selectedModel: string | null = null;
            if (config.model.selectedModel) {
                if (config.model.models!.includes(config.model.selectedModel)){
                    selectedModel = config.model.selectedModel
                } else {
                    if (config.model.models!.length > 0) {
                        selectedModel = config.model.models![0]
                    }
                }
            } else {
                if (config.model.models && config.model.models.length > 0) {
                    selectedModel = config.model.models[0]
                }
            }
            if (selectedModel) {
                setPersonalizedSelectedModel(selectedModel)
            }
        }

        // Set prompts
        if (config.prompts !== undefined) {
            let selectedModel = 'chatgpt'
            if (config.model.name === "Personalized") {
                selectedModel = config.model.selectedModel ?? 'chatgpt'
            }
            
            if (selectedModel in config.prompts) {
                const prompts = config.prompts[selectedModel];

                if (prompts.hasOwnProperty("summary")) {
                    setSummaryPrompt(prompts.summary);
                }
                if (prompts.hasOwnProperty("bullet_points")) {
                    setBulletPointPrompt(prompts.bullet_points);
                }
                if (prompts.hasOwnProperty("topic_name")) {
                    setTopicNamePrompt(prompts.topic_name);
                }
            }

            let prompts: LLMPrompts = { 
                ...defaultLLMPrompts,
            }

            Object.entries(config.prompts).forEach(([key, value]) => {
                prompts[key] = {
                    ...defaultLLMPrompts.default, 
                    summary: value.summary,
                    bulletPoint: value.bullet_points,
                    topicName: value.topic_name,
                }
            });
            setDefaultPrompts(prompts)
        }
        setsummaryLen(config.article_summary_length.toString());
        setmaxBulletPoint(config.max_bullet_points.toString());
        setSpiderIntervalSeconds(config.spider_interval_seconds.toString());
        setModelIterationPersistanceDays(config.model_iteration_persistence_days.toString());
    }

    async function fetchSetConfig() {
        fetch(`${baseApiUrl}${configEndpoint}`)
            .then(async (resp) => {
                const data = await resp.json();
                const config: Configuration = { ...data };
                setConfig({ config: config });
                setLoadingConfig(false);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    // Fetch data from backend to display values.
    useEffect(() => {
        fetchSetConfig();
    }, [])

    // Set model name based on radio button selection and personalized model selection
    useEffect(() => {
        let modelNameUpdate = "gpt4all"
        if (modelTypeRadio === "ChatGPT") {
            modelNameUpdate = "chatgpt"
        } else if (modelTypeRadio === "Personalized") {
            modelNameUpdate = personalizedSelectedModel ?? "gpt4all"
        }
        if (defaultPrompts.hasOwnProperty(modelNameUpdate)) {
            setSummaryPrompt(defaultPrompts[modelNameUpdate]['summary'])
            setBulletPointPrompt(defaultPrompts[modelNameUpdate]['bulletPoint'])
            setTopicNamePrompt(defaultPrompts[modelNameUpdate]['topicName'])
        } else {
            setSummaryPrompt(defaultPrompts.default.summary)
            setBulletPointPrompt(defaultPrompts.default.bulletPoint)
            setTopicNamePrompt(defaultPrompts.default.topicName)
        }
        setModelName(modelNameUpdate)
    }, [modelTypeRadio, personalizedSelectedModel])

    async function validatePrompta(setResult: (v: string)=> void){}

    function validatePrompt(setResult: (v: string)=> void){
        const timerid = setTimeout(async ()=>{
            await validatePrompta(setResult)
        }, 1000)
        clearTimeout(timerid)
    }

    return (

        <div>
            <div className='header'>
                <NavbarTop2 />
            </div>
            {loadingConfig ? <div className="jd-flex align-items-center justify-content-center text-center p-3">
                <p>Loading configuration...</p>
                <Spinner animation="border" role="status" className="justify-">
                    <span className="visually-hidden"></span>
                </Spinner>
            </div> :
                <Container fluid className='p-2'>
                    <div className='p-2'>
                        <Row className="align-items-center justify-content-center g-0">
                            <Col xxl={8} lg={8} md={8} xs={12} className="py-8 py-xl-0">
                                <Card>
                                    <Card.Header className="p-4 bg-white">
                                        <h3 className="mb-0">Policy News Tracker Configuration</h3>
                                    </Card.Header>

                                    <Card.Body >
                                        <Form 
                                        onSubmit={handleSubmit} 
                                        noValidate
                                        >
                                            <Row className="align-items-center gap-3">
                                                <DataModel
                                                    dataModelChatGPT={{
                                                        selected: modelTypeRadio,
                                                        setSelected: setModelTypeRadio,
                                                        APIKey: gptApiKey,
                                                        setAPIKey: setGptApiKey,
                                                        serverValid: serverValid,
                                                        setServerValid: setServerValid,
                                                        defaultPrompts: defaultPrompts,
                                                    }}
                                                    dataModelPersonalized={{
                                                        selected: modelTypeRadio,
                                                        setSelected: setModelTypeRadio,
                                                        serverValid: serverValid,
                                                        setServerValid: setServerValid,
                                                        APIKey: personalizedApiKey,
                                                        setAPIKey: setPersonalizedApiKey,
                                                        host: personalizedHost,
                                                        setHost: setPersonalizedHost,
                                                        port: personalizedPort,
                                                        setPort: setPersonalizedPort,
                                                        selectedModel: personalizedSelectedModel,
                                                        setSelectedModel: setPersonalizedSelectedModel,
                                                        availableModels: personalizedAvailableModels,
                                                        setAvailableModels: setPersonalizedAvailableModels,
                                                        defaultPrompts: defaultPrompts,
                                                    }}
                                                    dataModelPrompts={{
                                                        modelType: modelTypeRadio,
                                                        modelName: modelName,
                                                        host: personalizedHost,
                                                        port: personalizedPort,
                                                        api_key: personalizedApiKey,
                                                        summaryPrompt: summaryPrompt,
                                                        setSummaryPrompt: setSummaryPrompt,
                                                        bulletPointsPrompt: bulletPointPrompt,
                                                        setBulletPointsPrompt: setBulletPointPrompt,
                                                        topicNamePrompt: topicNamePrompt,
                                                        setTopicNamePrompt: setTopicNamePrompt,
                                                        defaultPrompts: defaultPrompts,
                                                    }}
                                                />

                                                <BackEndConfig props={{
                                                    articleSummaryLength: summaryLen,
                                                    setArticleSummaryLength: setsummaryLen,
                                                    maxBulletPoints: maxBulletPoint,
                                                    setMaxBulletPoints: setmaxBulletPoint,
                                                    spiderIntervalSeconds: spiderIntervalSeconds, //TODO change
                                                    setSpiderIntervalSeconds: setSpiderIntervalSeconds, // TODO change
                                                    modelIterationPersistanceDays: modelIterationPersistanceDays, // TODO change
                                                    setModelIterationPersistanceDays: setModelIterationPersistanceDays, // TODO change
                                                }}></BackEndConfig>

                                                <Col xs={12}>
                                                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                                        <Button variant="warning" onClick={() => router.push("/")}>
                                                            Cancel
                                                        </Button>
                                                        
                                                        <Button 
                                                        variant="success" 
                                                        type="submit" 
                                                        role="button" 
                                                        disabled={serverValid ? false : true }>
                                                            Submit
                                                        </Button>
                                                    </div>

                                                    <ModalSubmitStatus
                                                        show={showModalSubmit}
                                                        onHide={() => setShowModalSubmit(false)}
                                                    />

                                                    <ModalWarning
                                                        show={showModalWarning}
                                                        onHide={() => setShowModalWarning(false)}
                                                    />
                                                </Col>
                                            </Row>

                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Container>}
        </div>
    );
};

export default Config;
