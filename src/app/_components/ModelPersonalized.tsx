import React, { useEffect, useState } from "react";
import { Button, Card, Col, Dropdown, DropdownItem, Form, InputGroup, Modal, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { BackEndProps, DataModelProps, ModelChatGPTProps, ModelPersonalizedProps } from "app/(secure)/config/config.d";
import { validateLLMServer } from "app/(secure)/config/validateServer";
import OpenAI from 'openai';


export function ModelPersonalized({
    selected, setSelected,
    serverValid, setServerValid,
    host, setHost,
    port, setPort,
    APIKey, setAPIKey,
    selectedModel, setSelectedModel,
    availableModels, setAvailableModels }: ModelPersonalizedProps) {
    const [APIKeyRequired, setAPIKeyRequired] = React.useState(false)

    const [validatingServer, setValidatingServer] = React.useState(false)
    const [serverValidationError, setServerValidationError] = useState<String[] | null>(null)

    const [showModalError, setShowModalError] = useState(false)


    async function validateServer() {
        setValidatingServer(true)
        const ret = await validateLLMServer({
            host: host ?? '',
            port: Number(port) ?? '',
            api_key: APIKey!
        })

        if (ret.status) {
            setServerValid(true)
            setServerValidationError(null)
            setAvailableModels!((ret.body as { models?: string[] }).models || [])
        } else {
            setServerValid(false)
            setServerValidationError([ret.message!])
            setShowModalError(true)
        }
        setValidatingServer(false)
    }

    useEffect(() => {
        if (selected === "Personalized") {
            validateServer()
        }
    }, [])

    return (
        <Col xl={12} md={12} xs={12}>
            <Row className="mb-3">
                <Col xl={1} lg={2} md={2} xs={12} className="mb-3 mb-lg-0">
                    <Form.Check.Input
                        type="radio"
                        name="modelInputRadio"
                        value="Personalized"
                        onChange={() => {
                            setSelected("Personalized")
                            setServerValid(false)
                        }
                        }
                        checked={selected === "Personalized"}
                    />
                </Col>
                <Col xl={11} lg={10} md={10} xs={12} className="mb-3 mb-lg-0">
                    <Form.Label as={Col} md={4} htmlFor="default">
                        <h5>
                            Personalized Model
                        </h5>
                    </Form.Label>
                </Col>
            </Row>


            <Row className="mb-3">
                {/* Host Name */}
                <Col xl={3} lg={3} md={3} xs={12} className="mb-3 mb-lg-0">
                </Col>
                <Col xl={3} lg={3} md={3} xs={12} className="mb-3 mb-lg-0">
                    <OverlayTrigger overlay={<Tooltip>The host name. E.g. https://127.0.0.1</Tooltip>}>
                        <Form.Label>
                            Host{""}
                        </Form.Label>
                    </OverlayTrigger>
                </Col>

                <Col xl={6} lg={6} md={6} xs={12} className="mb-3 mb-lg-0">
                    <Form.Control
                        type="text"
                        placeholder="Enter Host IP address."
                        id="personalizedHost"
                        value={host || ""}
                        isInvalid={selected === "Personalized" && !host}
                        onChange={(v) => {
                            setHost!(v.target.value)
                            setServerValid(false)
                        }}
                        required={selected === "Personalized"}
                    />
                    <Form.Control.Feedback type="invalid">Please, provide a valid host.</Form.Control.Feedback>
                </Col>
            </Row>

            {/* Host port */}
            <Row className="mb-3">
                <Col xl={3} lg={3} md={3} xs={12} className="mb-3 mb-lg-0">
                </Col>
                <Col xl={3} lg={3} md={3} xs={12} className="mb-3 mb-lg-0">
                    <OverlayTrigger
                        overlay={<Tooltip>The port used by the host.</Tooltip>}>
                        <Form.Label>
                            Host Port{" "}
                        </Form.Label>
                    </OverlayTrigger>
                </Col>
                <Col xl={6} lg={6} md={6} xs={12} className="mb-3 mb-lg-0">
                    <Form.Control
                        type="text"
                        placeholder="Enter Host Port Number"
                        id="personalizedPort"
                        value={port || ""}
                        isInvalid={selected === "Personalized" && !port}
                        onChange={(v) => {
                            setPort!(v.target.value)
                            setServerValid(false)
                        }}
                        required={selected === "Personalized"}
                    />
                </Col>
            </Row>


            {/* Api key (if implemented) */}
            <Row className="mb-3">
                <Col xl={3} lg={3} md={3} xs={12} className="mb-3 mb-lg-0">
                </Col>
                <Col xl={3} lg={3} md={3} xs={12} className="mb-3 mb-lg-0">
                    <OverlayTrigger
                        overlay={<Tooltip>The api key, if used.</Tooltip>}>
                        <Form.Label>
                            API Key Value{" "}
                        </Form.Label>
                    </OverlayTrigger>
                </Col>
                <Col xl={6} lg={6} md={6} xs={12} className="mb-3 mb-lg-0">
                    <Form.Control
                        type="text"
                        placeholder="Enter API Key Value"
                        id="personalizedApiKey"
                        value={APIKey || ""}
                        isInvalid={selected === "Personalized" && APIKeyRequired && !APIKey}
                        onChange={(v) => {
                            setAPIKey!(v.target.value)
                            setServerValid(false)
                        }}
                        required={APIKeyRequired}
                    />
                </Col>
            </Row>

            {/* Model type */}
            <Row className="mb-3">
                <Col xl={3} lg={3} md={3} xs={12} className="mb-3 mb-lg-0">
                </Col>
                <Col xl={3} lg={3} md={3} xs={12} className="mb-3 mb-lg-0">
                    <OverlayTrigger
                        overlay={<Tooltip>Model types available in the deployed server.</Tooltip>}>
                        <Form.Label>
                            Model Type{" "}
                        </Form.Label>
                    </OverlayTrigger>
                </Col>
                <Col xl={6} lg={6} md={6} xs={12} className="mb-3 mb-lg-0">
                    <Dropdown className="caret">
                        <Dropdown.Toggle variant="" bsPrefix="dropdown-toggle">
                            {selectedModel}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {availableModels! ?
                                availableModels!.map((v, index) => <DropdownItem key={index} onClick={(e) => setSelectedModel!(v)}>{v}</DropdownItem>)
                                : null}
                        </Dropdown.Menu>

                    </Dropdown>

                </Col>
            </Row>

            {/* Validate server button */}
            {selected === "Personalized" ?
                <Row >
                    <Col xs={12} className="">
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">

                            <Button
                                className="align-self-end"
                                variant={serverValid ? "success" : "primary"}
                                onClick={validateServer}
                                disabled={validatingServer}
                            >
                                {validatingServer ? "Validating..." :
                                    serverValid ?
                                        "Server Validated" :
                                        "Validate Server"
                                }

                            </Button>
                        </div>
                        <Modal show={showModalError}
                            onHide={() => setShowModalError(false)}
                            size="lg"
                            centered
                        >
                            <Modal.Header closeButton >
                                <Modal.Title><h4 className="mb-1" id="billingAddressModalLabel">Validation Error</h4></Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {serverValidationError?.map((v, index) => <p key={index}>{v}</p>)}
                            </Modal.Body>

                        </Modal>
                    </Col>
                </Row>
                : null}
        </Col>
    )
}

function ModelChatGPT({ selected, setSelected, APIKey, setAPIKey, serverValid, setServerValid }: ModelChatGPTProps) {


    const [validatingServer, setValidatingServer] = React.useState(false)
    const [serverValidationError, setServerValidationError] = useState<String[] | null>(null)

    const [showModalError, setShowModalError] = useState(false)

    useEffect(() => setServerValid(false), [selected])

    async function validateServer() {
        setValidatingServer(true)

        const client = new OpenAI({apiKey: APIKey, dangerouslyAllowBrowser: true})
        const chatCompletion = await client.chat.completions.create({
            messages: [{ role: 'user', content: 'Say this is a test' }],
            model: 'gpt-3.5-turbo',
          })
          .then((v) => {
            setServerValid(true)
            return v
          })
          .catch((err) => {
            setServerValidationError([String(err)])
            setShowModalError(true)
            setServerValid(false)
        })
        setValidatingServer(false)
    }

    useEffect(() => {
        if (selected === "ChatGPT") {
            validateServer()
        }
    }, [])

    return (
        <Col xl={12} md={12} xs={12}>
            <Row className="mb-3">
                <Col xl={1} lg={2} md={2} xs={12} className="mb-3 mb-lg-0">
                    <Form.Check.Input
                        type="radio"
                        name="modelInputRadio"
                        value="ChatGPT"
                        onChange={() => setSelected("ChatGPT")}
                        checked={selected === "ChatGPT"}
                    />
                </Col>
                <Col xl={11} lg={10} md={10} xs={12} className="mb-3 mb-lg-0">
                    <Form.Label as={Col} md={4} htmlFor="default">
                        <h5>
                            ChatGPT Model
                        </h5>
                    </Form.Label>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col xl={3} lg={3} md={3} xs={12} className="mb-3 mb-lg-0">
                </Col>
                <Col xl={3} lg={3} md={3} xs={12} className="mb-3 mb-lg-0">
                    <Form.Label>
                        API Key Value{" "}
                    </Form.Label>
                </Col>
                <Col xl={6} lg={6} md={6} xs={12} className="mb-3 mb-lg-0">

                    <Form.Control
                        type="text"
                        placeholder="Enter API Key Value"
                        id="gptApiKey"
                        value={APIKey! || ""}
                        isInvalid={selected === "ChatGPT" && APIKey === ""}
                        onChange={(event) => { setAPIKey!(event.target.value) }}
                        required={selected === "ChatGPT"}
                    />
                    <Form.Control.Feedback type="invalid">
                        ChatGPT requires a valid API Key, usually on a paid tier.
                    </Form.Control.Feedback>
                </Col>
            </Row>


            {/* Validate server button */}
            {selected === "ChatGPT" ?
                <Row>
                    <Col xs={12} className="">
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">

                            <Button
                                className="align-self-end"
                                variant={serverValid ? "success" : "primary"}
                                onClick={validateServer}
                                disabled={validatingServer}
                            >
                                {validatingServer ? "Validating..." :
                                    serverValid ?
                                        "Server Validated" :
                                        "Validate Server"
                                }

                            </Button>
                        </div>
                        <Modal show={showModalError}
                            onHide={() => setShowModalError(false)}
                            size="lg"
                            centered
                        >
                            <Modal.Header closeButton >
                                <Modal.Title><h4 className="mb-1" id="billingAddressModalLabel">Validation Error</h4></Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {serverValidationError?.map((v, index) => <p key={index}>{v}</p>)}
                            </Modal.Body>

                        </Modal>
                    </Col>
                </Row> : null}
        </Col>
    )
}


export default function DataModel({ dataModelPersonalized, dataModelChatGPT }: DataModelProps) {
    
    return (
        <Card>
            <Card.Header>
                <OverlayTrigger overlay={<Tooltip>The model that is used to summarize articles, create bullet-point  summary for topics.</Tooltip>}>
                    <h4>
                        Large Language Model
                    </h4>
                </OverlayTrigger>
            </Card.Header>
            <Card.Body>
                <Row>
                    <ModelPersonalized
                        selected={dataModelPersonalized.selected}
                        setSelected={dataModelPersonalized.setSelected}
                        serverValid={dataModelPersonalized.serverValid}
                        setServerValid={dataModelPersonalized.setServerValid}
                        host={dataModelPersonalized.host}
                        setHost={dataModelPersonalized.setHost}
                        port={dataModelPersonalized.port}
                        setPort={dataModelPersonalized.setPort}
                        APIKey={dataModelPersonalized.APIKey}
                        setAPIKey={dataModelPersonalized.setAPIKey}
                        selectedModel={dataModelPersonalized.selectedModel}
                        setSelectedModel={dataModelPersonalized.setSelectedModel}
                        availableModels={dataModelPersonalized.availableModels}
                        setAvailableModels={dataModelPersonalized.setAvailableModels}
                    />

                    <Col xs={12}>
                        <hr className="mb-4" />
                    </Col>
                    <ModelChatGPT
                        selected={dataModelChatGPT.selected}
                        setSelected={dataModelChatGPT.setSelected}
                        APIKey={dataModelChatGPT.APIKey}
                        setAPIKey={dataModelChatGPT.setAPIKey}
                        serverValid={dataModelChatGPT.serverValid}
                        setServerValid={dataModelChatGPT.setServerValid}
                    />
                </Row>
            </Card.Body>
        </Card>
    )
}


export function BackEndConfig({ props }: { props: BackEndProps }) {
    return (
        <Card>
            <Card.Header>
                <h4>
                    Backend Configuration
                </h4>
            </Card.Header>
            <Card.Body>
                <Col xl={12} md={12} xs={12} className="mb-3">

                    {/* Article Summary Length */}
                    <Row className="mb-3">
                        <Col xl={3} lg={3} md={3} xs={12} className="mb-3 mb-lg-0">
                            <OverlayTrigger overlay={<Tooltip>The length of the article summary. There is a limit on the number of input encodings for machine learning models to classify topics. Bert, the model being used, has a limitation of 512 words as inputs.</Tooltip>}>
                                <Form.Label>
                                    <h5>
                                        Article Summary Length <span style={{ color: "red" }}>*</span>
                                    </h5>
                                </Form.Label>
                            </OverlayTrigger>
                        </Col>
                        <Col xl={9} lg={9} md={9} xs={12} className="mb-3 mb-lg-0">
                            <Form.Group>
                                <InputGroup hasValidation>
                                    <Form.Control
                                        type="number"
                                        placeholder="Article Summary Length"
                                        id="summaryLen"
                                        value={props.articleSummaryLength}
                                        onChange={(e) => props.setArticleSummaryLength(e.target.value)}
                                        isInvalid={Number(props.articleSummaryLength) < 20 || Number(props.articleSummaryLength) > 512}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Article summary length should be between 20 and 512.
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Max Bullet Points */}
                    <Row className="mb-3">
                        <Col xl={3} lg={3} md={3} xs={12} className="mb-3 mb-lg-0">
                            <OverlayTrigger overlay={
                                <Tooltip>
                                    The maximum number of bullet points to summarize a given topic.
                                </Tooltip>
                            }>
                                <Form.Label>
                                    <h5>
                                        Max Bullet Points <span style={{ color: "red" }}>*</span>
                                    </h5>
                                </Form.Label>
                            </OverlayTrigger>
                        </Col>
                        <Col xl={9} lg={9} md={9} xs={12} className="mb-3 mb-lg-0">
                            <Form.Group>
                                <InputGroup hasValidation>
                                    <Form.Control
                                        type="number"
                                        placeholder="Max Bullet Points"
                                        id="maxBulletPoint"
                                        value={props.maxBulletPoints}
                                        onChange={(e) => props.setMaxBulletPoints(e.target.value)}
                                        min={1}
                                        isInvalid={!props.maxBulletPoints || Number(props.maxBulletPoints) < 1}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Should be greater than 0.
                                    </Form.Control.Feedback>
                                </InputGroup>

                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Model Iteration persistence days */}
                    <Row className="mb-3">
                        <Col xl={3} lg={3} md={3} xs={12} className="mb-3 mb-lg-0">
                            <OverlayTrigger overlay={
                                <Tooltip>
                                    <p>
                                        The number of days the model will persist in the database. After this period, the model iteration will be deleted.
                                    </p>
                                </Tooltip>
                            }>
                                <Form.Label>
                                    <h5>
                                        Model Iteration persistence days <span style={{ color: "red" }}>*</span>
                                    </h5>
                                </Form.Label>
                            </OverlayTrigger>
                        </Col>
                        <Col xl={9} lg={9} md={9} xs={12} className="mb-3 mb-lg-0">
                            <Form.Group>
                                <InputGroup hasValidation>
                                    <Form.Control
                                        type="number"
                                        placeholder="Model Iteration persistence days"
                                        id="modelIterationPersistenceDays"
                                        value={props.modelIterationPersistanceDays}
                                        onChange={(e) => props.setModelIterationPersistanceDays(e.target.value)}
                                        min={1}
                                        max={90}
                                        isInvalid={Number(props.modelIterationPersistanceDays) < 1 || Number(props.modelIterationPersistanceDays) > 90}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        A number between 1 and 90.
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Spider interval */}
                    <Row className="mb-3">
                        <Col xl={3} lg={3} md={3} xs={12} className="mb-3 mb-lg-0">
                            <OverlayTrigger overlay={
                                <Tooltip>
                                    <p>
                                        The interval in seconds at which the spider will crawl the News website for new articles. After crawling the news website, it will wait for this period to crawl the News website again. </p>
                                </Tooltip>
                            }>
                                <Form.Label>
                                    <h5>
                                        Spider interval (seconds) <span style={{ color: "red" }}>*</span>
                                    </h5>
                                </Form.Label>
                            </OverlayTrigger>
                        </Col>
                        <Col xl={9} lg={9} md={9} xs={12} className="mb-3 mb-lg-0">
                            <Form.Group>
                                <InputGroup hasValidation>
                                    <Form.Control
                                        type="number"
                                        placeholder="Spider interval"
                                        id="spiderInterval"
                                        value={props.spiderIntervalSeconds}
                                        onChange={(e) => props.setSpiderIntervalSeconds(e.target.value)}
                                        isInvalid={Number(props.spiderIntervalSeconds) < 20 || Number(props.spiderIntervalSeconds) > 10800}
                                        min={20}
                                        max={10800}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        The interval should be between 20 and 10800 seconds (3 hours).
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Col>
                    </Row>

                </Col>
            </Card.Body>
        </Card>
    )
}
