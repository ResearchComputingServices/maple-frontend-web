import React, { BaseSyntheticEvent, useEffect, useState } from "react";
import { Button, Card, Col, Dropdown, DropdownItem, Form, InputGroup, Modal, OverlayTrigger, Row, Spinner, Tooltip } from "react-bootstrap";
import { BackEndProps, DataModelProps, ModelChatGPTProps, ModelPersonalizedProps, ModelType } from "app/_types/config.d";
import { buildLLMServerConfig, LLMServerBulletPoint, LLMServerTopicName, testLLMServer, validateLLMServer } from "app/(secure)/config/validateServer";
import OpenAI from 'openai';
import { BootstrapReboot, Bug, BugFill, EraserFill } from 'react-bootstrap-icons';
import axios from "axios";

const sampleArticles: Array<string> = [
    `LONDON - \n\tTikTok said Tuesday that operations are underway at the first of its three European data centres, part of the popular Chinese owned app's effort to ease Western fears about privacy risks.\n\r\n\n\r\n\tThe video sharing app said it began transferring European user information to a data centre in Dublin. Two more data centres, another in Ireland and one in Norway, are under construction, TikTok said in an update on its plan to localize European user data, dubbed Project Clover.\n\r\n\n\r\n\t\n\r\n\t\t\nTop science and technology headlines, all in one place\n\r\n\n\r\n\n\r\n\tTikTok has been under scrutiny by European and American regulators over concerns that sensitive user data may end up in China. TikTok is owned by ByteDance, a Chinese company that moved its headquarters to Singapore in 2020.\n\r\n\n\r\n\tTikTok unveiled its plan earlier this year to store data in Europe, where there are stringent privacy laws, after a slew of Western governments banned the app from official devices.\n\r\n\n\r\n\tNCC Group, a British cybersecurity company, is overseeing the project, TikTok's vice president of public policy for Europe, Theo Bertram, said in a blog post.\n\r\n\n\r\n\tNCC Group will check data traffic to make sure that only approved employees \"can access limited data types\" and carry out \"real-time monitoring\" to detect and respond to suspicious access attempts, Bertram said.\n\r\n\n\r\n\t\"All of these controls and operations are designed to ensure that the data of our European users is safeguarded in a specially-designed protective environment, and can only be accessed by approved employees subject to strict independent oversight and verification,\" Bertram said.\n\r\n\n`,
    `\tTravelling can be costly and often financially inaccessible. But in a bid to ease the concerns of travellers grappling with the escalating cost of living and travel expenses, Google Flights is introducing three new features to help individuals discover budget-friendly options.\n\r\n\n\r\n\tAny thrifty traveller knows the first secret to finding cheap flights is to book in advance. But there’s always the pressing question: is it better to book now or wait for lower prices to come along?\n\r\n\n\r\n\tGoogle Flights’ new trend data will help answer that question. When searching for flights, the site now shows when prices have typically been lowest based on dates and destinations. This will make it easier to know if prices are usually lower two months in advance or closer to takeoff.\n\r\n\n\r\n\tThe second feature update allows travellers to track prices to a specific destination with an automated notification email if tickets drop significantly. This feature has two notification options between specific dates or “Any dates” which could include deals anytime between three to six months from the date enabled.\n\r\n\n\r\n\tThe third feature, although it’s only available as part of a pilot program for selected bookings departing from the U.S., might offer travellers an enhanced peace of mind. It’s a “price guarantee” option.\n\r\n\n\r\n\t“You’ll see a colourful price guarantee badge, which means we’re especially confident the fare you see today won’t get any lower before departure,” reads the site.\n\r\n\n\r\n\tIf prices do drop, Google will pay the person the ticket’s difference via Google Pay.\n\r\n\n\r\n\tThese new features come at a time when many Canadians are voicing apprehension about travelling in 2023 due to \nfinancial constraints at home\n.\n\r\n\n\r\n\tIn a recent \nsurvey by Nanos Research\n, commissioned by CTV News, 38 per cent of Canadians say they were more likely to spend less on their summer travel plans, an increase from 31 per cent reported in 2015. Additionally, 57 per cent of Canadians say they have no interest in travelling internationally this year.\n\r\n\n\r\n\tThe poll surveyed 1,055 Canadians over the ages of 18 through phone calls — both land and cell lines — and online between June 29 and June 30.\n\r\n\n\r\n\tFor some of the Canadians who do end up travelling, the expected downtime is not so restful as this time is usually filled with stress, guilt or work-related activities, another survey found.\n\r\n\n\r\n\tAnother \nstudy conducted by ELVTR\n, a U.S.-based online education platform, revealed a majority of American and Canadian workers (68 per cent) can’t stop engaging in work-related activities during their vacations.\n\r\n\n\r\n\tThis could put a damper on any vacations or travel plans as people are spending money to get away from work and routine without succeeding.\n\r\n\n\r\n\tThe survey, which involved 2,300 workers from Canada and the U.S., found that the recession and economic downturn have had an impact on vacation time for many working Canadians. For instance, 37 per cent of surveyed Canadians are taking less time off, while 20 per cent are unable to take vacations at all due to understaffing following company layoffs.\n\r\n\n\r\n\tFor those who can take time off and are looking to fly during the winter holiday, Google says the best deals are around early October as prices tend to be the lowest 71 days before departure for trips starting in mid-December. The best window to buy tickets is now 54-78 days before takeoff.\n\r\n\n`,
    `Google Flights is introducing three new features to help travellers find budget-friendly options. The first feature shows when prices are typically lowest based on dates and destinations, helping travellers decide whether to book now or wait for lower prices. The second feature allows travellers to track prices to a specific destination and receive automated email notifications if tickets drop significantly. The third feature is a \"price guarantee\" option, currently part of a pilot program for selected bookings departing from the US, where Google will pay the difference via Google Pay if prices drop after purchase. These features come at a time when many Canadians are apprehensive about travelling in 2023 due to financial constraints at home. A recent survey found that 38% of Canadians were more likely to spend less on summer travel plans, and 57% have no interest in travelling internationally this year. Another study revealed that a majority of American and Canadian workers can't stop engaging in work-related activities during their vacations, which could impact their ability to fully enjoy their time off. The recession and economic downturn have also affected vacation time for many working Canadians, with 37% taking less time off and 20% unable to take vacations due to understaffing. For those looking to fly during the winter holiday, Google suggests that the best deals are available around early October, with the lowest prices typically 71 days before departure. The best window to buy tickets is now 54-78 days before takeoff.`,
    `\tIf you are feeling anxious about making phone calls to strangers, you're not alone. According to a recent survey, over half of Canadians share the concern.\n\r\n\n\r\n\tIn an online survey conducted by Research Co., 53 per cent of Canadians reported feeling anxious when they have to make a phone call to a person they do not know.\n\r\n\n\r\n\t“Two-thirds of Canadians aged 18-to-34 (66 per cent) dread a telephone conversation with a stranger,” Research Co. president Mario Canseco said in a\n press release\n. “The proportions are lower among their counterparts aged 35-to-54 (55 per cent) and aged 55 and over (40 per cent).”\n\r\n\n\r\n\tWhen it comes to text messages and emails, Canadians' opinions remain divided—46 per cent of people believe this form of communication is impersonal, while 47 per cent disagree, according to Research Co.\n\r\n\n\r\n\tBreaking down the data by region, nearly half (49 per cent) of Saskatchewan and Manitoba residents are more likely to consider text messages and emails as impersonal. This proportion is slightly lower among people in Ontario (48 per cent) and British Columbia (47 per cent), and even lower in Quebec (44 per cent), Atlantic Canada (42 per cent) and Alberta (41 per cent).\n\r\n\n\r\n\tWhen Canadians were asked about their feelings regarding giving a speech in front of others, 43 per cent of respondents stated that they have no fear of doing so. However, this proportion drops to 39 per cent among women.\n\r\n\n\r\n\tThe survey also shows that Canadians prefer certain modes of communication for certain tasks.\n\r\n\n\r\n\tFor instance, over a third of Canadians (35 per cent) would opt to make a phone call if they had to ask a question to their municipality or City Hall, while 31 per cent would choose to send an email, and 22 per cent would prefer to schedule a meeting in person.\n\r\n\n\r\n\tForty-one per cent of Canadians said they would choose to place a phone call when they have a question for their bank, while about three-in-ten (31 per cent) would opt for an in-person meeting. However, fewer Canadians would choose to communicate with their financial institution via email (11 per cent), an app (nine per cent) or a text message (seven per cent).\n\r\n\n\r\n\tWhen it comes to ending a relationship, 77 per cent of Canadians believe that the best way to do so is in person.\n\r\n\n\r\n\tFor nine per cent of people, a text message would be considered a reasonable way to break up, with this proportion rising to 13 per cent among those aged 18-to-34, according to the survey.\n\r\n\n\r\n\tWhen asked which option they prefer when resigning from a job, 68 per cent of Canadians choose to do it in person, while 13 per cent would opt to leave a position after sending an email, with this choice being made by 19 per cent of Canadians aged 35-to-54.\n\r\n\n\r\n\tCanadians continue to be divided on their preferred method of ordering food delivery to their home, with very similar proportions opting for a phone call (40 per cent) or using an app (38 per cent).\n\r\n\n\r\n\t \n\r\n\n\r\n\t\nMethodology\n:\n\r\n\n\r\n\t\nResults are based on an online study conducted from August 17 to August 19, 2023, among 1,000 adults in Canada. The data has been statistically weighted according to Canadian census figures for age, gender and region. The margin of error, which measures sample variability, is +/- 3.1 percentage points, nineteen times out of twenty.\n\r\n\n\r\n\t \n\r\n\n\r\n\t\nReporting for this story was paid for through The Afghan Journalists in Residence Project funded by Meta.\n\r\n\n`,
    `A recent survey conducted by Research Co. found that over half of Canadians feel anxious when making phone calls to strangers. The survey found that 53% of Canadians experience anxiety when they have to make a phone call to an unfamiliar person. The highest proportion of anxiety was found among Canadians aged 18-34, with 66% reporting dread about telephone conversations with strangers. In comparison, 55% of Canadians aged 35-54 reported anxiety, and 40% of Canadians aged 55 and over experience the same feeling.\n\nOpinions among Canadians were divided when it comes to text messages and emails. Approximately 46% of respondents believe that these forms of communication are impersonal, while 47% disagree.\n\nThe survey also revealed regional differences in opinions. Saskatchewan and Manitoba had the highest percentage (49%) of residents who considered text messages and emails impersonal, followed by Ontario (48%), British Columbia (47%), Quebec (44%), Atlantic Canada (42%), and Alberta (41%).\n\nIn terms of preferred communication methods for specific tasks, Canadians showed a preference for phone calls. For example, 35% of Canadians would choose to make a phone call to their municipality or City Hall if they had a question, while 31% would opt for email and 22% for an in-person meeting. When it comes to questions for their bank, 41% would choose a phone call, while 31% would prefer an in-person meeting.\n\nThe survey also asked Canadians how they prefer to end a relationship or resign from a job. The majority (77%) believe that it should be done in person, although 9% of respondents considered a text message as a reasonable option for ending a relationship. When it comes to resigning from a job, 68% of Canadians prefer to do it in person, while 13% would choose to send an email.\n\nFinally, Canadians were divided on their preferred method of ordering food delivery, with 40% preferring a phone call and 38% using an app.\n\nThe online survey was conducted from August 17 to August 19, 2023, and included 1,000 adults in Canada. The results were statistically weighted according to Canadian census figures and have a margin of error of +/- 3.1 percentage points. The study was funded by Meta through The Afghan Journalists in Residence Project.`,
]

const DEFAULT_QUESTION = `You are a reporter. Your task is to create a summary of an article with a limit of 50 words. Do not include any description of the task.

# Article:
The former chief financial officer for Royal Bank of Canada is suing the bank for almost $50 million over claims of wrongful dismissal.

RBC announced on April 5 that it had fired Nadine Ahn after an internal review found evidence she was in an "undisclosed close personal relationship" with another employee who received preferential treatment, including promotion and compensation increases, which violated the bank's code of conduct.

A lawsuit filed by Ahn in the Ontario Superior Court of Justice on Thursday says there is no merit to the allegations, which it calls patently and categorically false.

The lawsuit states that Ahn denies providing preferential treatment to her colleague and that RBC's decision to fire her was tainted by gender-based stereotypes about friendships between women and men.

RBC spokesperson Gillian McArdle said in a statement that the facts are very clear that there was a significant breach of the bank's code of conduct, the claims in the lawsuit are without merit and the bank will vigorously defend against them in court.

The $48.9-million lawsuit, first reported by Bloomberg, includes seeking damages for wrongful dismissal, damages for defamation, punitive damages and other claims.
`
export function ModelPersonalizedQuestion(
    { isServerValid, host, port, api_key, model }: { isServerValid: boolean, host?: string, port?: string, api_key?: string, model?: string }
) {
    const [question, setQuestion] = useState(DEFAULT_QUESTION)
    const [answer, setAnswer] = useState('')
    const [loadingAnswer, setLoadingAnswer] = useState(false)

    async function AnswerQuestion() {
        setLoadingAnswer(true)
        setAnswer('')
        testLLMServer({ host: host!, port: String(port), api_key: api_key, model_type: model!, question: question })
            .then(response => {
                console.log("response for question", response)
                if (Array.isArray(response) && response.length > 0) {
                    setAnswer(response[0])
                }
                return response
            }, (reason) => {
                setAnswer('Failed retrieving answer.')
            })
            .catch(error => {
                console.error("Ooopsss")
                console.error(error);
            })
            .finally(() => setLoadingAnswer(false))
    }

    return (
        <>
            {isServerValid ?
                <div className="my-3">
                    <Form.Group className="mb-3">
                        <Form.Label>Question:</Form.Label>
                        <Form.Control
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            as="textarea"
                            rows={5} />
                    </Form.Group>
                    {!loadingAnswer && answer !== "" ?
                        <Form.Group className="mb-3">
                            <Form.Label>Answer:</Form.Label>
                            <Form.Control
                                type="text"
                                value={answer}
                                readOnly
                                as="textarea"
                                rows={5} />
                        </Form.Group> : null}

                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <Button
                            className=""
                            variant="success"
                            disabled={loadingAnswer}
                            onClick={async (e) => await AnswerQuestion()}>
                            {loadingAnswer ?
                                <>
                                    {/* <Row> */}
                                    <Spinner animation="border" role="status" size="sm" />
                                    <p>Loading</p>
                                    {/* </Row> */}
                                </>
                                : "Test model"}
                        </Button>
                    </div>
                </div>
                : null}
        </>
    )
}

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
        setServerValid(false)
        setValidatingServer(true)
        await validateLLMServer({
            host: host ?? '',
            port: Number(port) ?? '',
            api_key: APIKey!
        })
            .then((response) => {
                if (response.status) {
                    setServerValid(true)
                    setServerValidationError(null)
                    let availableModels = (response.body as { models?: string[] }).models || []
                    setAvailableModels!(availableModels)
                    if (!availableModels.includes(selectedModel!)) {
                        if (availableModels.length > 0) {
                            setSelectedModel!(availableModels[0])
                        } else {
                            setSelectedModel!("")
                        }
                    }

                } else {
                    setServerValid(false)
                    setServerValidationError([response.message!])
                    setShowModalError(true)
                }
                return response
            })
            .catch((error) => console.error(error))
            .finally(() => setValidatingServer(false))
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
            <ModelPersonalizedQuestion
                isServerValid={serverValid}
                host={host}
                port={port}
                api_key={APIKey}
                model={selectedModel!} />

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

        const client = new OpenAI({ apiKey: APIKey, dangerouslyAllowBrowser: true })
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

const defaultSummaryPrompt = "You are a reporter. Your task is to create a summary of an article with a limit of 50 words. Do not include any description of the task."
const defaultPrompt = "You are a reporter. Your task is to create a summary of an article with a limit of 50 words. Do not include any description of the task."
const defaultBulletPointPrompt = "Given the articles, create a list with maximum of 5 bullet points, and each bullet point should not exceed 50 words.\n#Articles:\n"
const defaultTopicNamePrompt = "You are provided with a list of keywords. Your task is to find the best possible word to represent them. Provide at least one word, and a maximum of 3 words.\n# Keywords:\n"

export interface LLMPrompts {
    [key: string]: {
        prompt: string,
        summary: string,
        bulletPoint: string,
        topicName: string
    },
    default: {
        prompt: string,
        summary: string,
        bulletPoint: string,
        topicName: string
    }
}

export const defaultLLMPrompts: LLMPrompts = {
    gpt4all: {
        "prompt": "gpt4all " + defaultPrompt,
        "summary": "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\nYou are an AI assistant to summarize an article in a maximum of 512 words. Do not include any description of the task. Do not include additional information. Stick to the facts. Your answer should include only the summary.<|eot_id|>\n<|start_header_id|>user<|end_header_id|>\nArticle: **articles** <|eot_id|>\n<|start_header_id|>assistant<|end_header_id|>",
        "bulletPoint": "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\nYou are an AI assistant to create a list of bullet points for a list of articles. Do not include any description of the task. Do not include additional information. Do not include an introduction such as \"here is the bullet points\". Do not include an explanation. Stick to the facts. Your answer should include only the the bullet points. Each bullet point should start with an asterisk, and contain a maximum of 50 words.<|eot_id|>\n<|start_header_id|>user<|end_header_id|>\nArticles: **articles** <|eot_id|>\n<|start_header_id|>assistant<|end_header_id|>",
        "topicName": "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\nYou are an AI assistant to generate a term for a list of keywords. You provide a term between 1 and 3 words. You should not provide any description of the task or assumptions on how you got to the answer.<|eot_id|>\n<|start_header_id|>user<|end_header_id|>\nKeywords: **keywords** <|eot_id|>\n<|start_header_id|>assistant<|end_header_id|>",
    },
    mistral: {
        "prompt": "mistral " + defaultPrompt,
        "summary": "<s>[INST] You are an AI assistant to summarize an article in a maximum of 512 words. Do not include any description of the task. Do not include additional information. Stick to the facts. Your answer should include only the summary.\n\nArticle: **articles** [/INST]</s>",
        "bulletPoint": "<s>[INST] You are an AI assistant to create a list of bullet points for a list of articles. Stick to the facts. Provide only the bullet points. Do not include an introduction such as \"here are the bullet points\". Each bullet point should start with asterisk. Each bullet point should contain a maximum of 50 words. Include a maximum of 5 bullet points.\nARTICLES: \n**articles** \n[/INST]</s>\n",
        "topicName": "<s>[INST] You are an AI assistant to generate a term for a list of keywords. You should provide a term between 1 and 3 words. You should not provide any description of the task or assumptions on how you got to the answer.\nKEYWORDS: \n**keywords** \n[/INST]</s>"
    },
    chatgpt: {
        "prompt": defaultPrompt,
        "summary": defaultSummaryPrompt,
        "bulletPoint": defaultBulletPointPrompt,
        "topicName": defaultTopicNamePrompt,
    },
    default: {
        "prompt": defaultPrompt,
        "summary": defaultSummaryPrompt,
        "bulletPoint": defaultBulletPointPrompt,
        "topicName": defaultTopicNamePrompt,
    }
}

interface DataModelPromptProps {
    label: string
    modelName: string,
    onValidation: () => void,
    validated: boolean,
    validating: boolean,
    setValidated: (v: boolean) => void,
    prompt: string,
    setPrompt: (v: string) => void,
    defaultPrompt: string,
    content: string,
    setContent: (v: string) => void,
    defaultContent: string,
    response: string | null,
    onPromptErrorMessage?: string,
    onContentErrorMessage?: string,
    props: any
}

function DataModelPrompt({
    label,
    modelName,
    onValidation,
    validated,
    validating,
    setValidated,
    prompt,
    setPrompt,
    defaultPrompt,
    content,
    setContent,
    defaultContent,
    response,
    onPromptErrorMessage,
    onContentErrorMessage,
    props }: DataModelPromptProps) {

    const [showResponse, setShowResponse] = useState<boolean>(false)

    useEffect(() => {
        setValidated(false)
    }, [modelName])

    function validatePrompt(e: BaseSyntheticEvent) {
        onValidation()
    }

    function changeTextField(e: BaseSyntheticEvent, setTextField: (v: string) => void) {
        setShowResponse(false)
        setValidated(false)
        setTextField(e.target.value)
    }

    function changePrompt(e: BaseSyntheticEvent) {
        changeTextField(e, setPrompt)
    }

    function changeContentSample(e: BaseSyntheticEvent) {
        changeTextField(e, setContent)
    }

    function resetDefaultContentSample(e: BaseSyntheticEvent) {
        setShowResponse(false)
        setValidated(false)
        setContent(defaultContent)
    }

    function resetPrompt(e: PointerEvent) {
        setShowResponse(false)
        setValidated(false)
        setPrompt(defaultPrompt)
        console.log(defaultPrompt)
    }

    function eraseTextField(setTextField: (v: string) => void) {
        setValidated(false)
        setTextField("")
    }

    function erasePrompt() {
        eraseTextField(setPrompt)
    }

    function eraseContentSample() {
        eraseTextField(setContent)
    }

    useEffect(() => {
        if (response) {
            // if (response && validated) {
            setShowResponse(true)
        }
        else {
            setShowResponse(false)
        }
    }, [response, validated])

    return <Row className="mb-3">
        <Row>
            <Col className="mb-3 mb-lg-0 d-flex gap-2 align-items-center">
                <Form.Text>
                    <h5>{label}</h5>
                </Form.Text>
                {
                    prompt && content && !validating ?
                        <BugFill
                            title="Debug prompt and content"
                            onClick={validatePrompt}
                            color={validated ? "green" : "red"}
                            {...props} /> :
                        <BugFill
                            title="Debug prompt and content"
                            color={"gray"}
                            {...props} />
                }

            </Col>
        </Row>

        {/* Prompt */}
        <Col xl={12} lg={12} md={12} xs={12} className="mb-3 mb-lg-0">
            <Row>
                <Col className="d-flex gap-2 ">
                    <Form.Text>
                        <h6>Prompt</h6>
                    </Form.Text>
                    <BootstrapReboot
                        onClick={resetPrompt}
                        {...props}
                    />
                    <EraserFill onClick={(e) => erasePrompt()} {...props} />
                </Col>
            </Row>
            <Form.Control
                type="text"
                as="textarea"
                rows={2}
                value={prompt}
                isInvalid={prompt === ""}
                onChange={changePrompt}
                required
            />
            <Form.Control.Feedback type="invalid">
                {onPromptErrorMessage}
            </Form.Control.Feedback>
        </Col>

        {/* Content */}
        <Col xs={12} className="mt-2">
            <Row>
                <Col className="d-flex gap-2">
                    <Form.Text>
                        <h6>Content</h6>
                    </Form.Text>
                    <BootstrapReboot {...props} onClick={resetDefaultContentSample} />
                    <EraserFill onClick={(e) => eraseContentSample()} {...props} />
                </Col>
            </Row>

            <Form.Control
                type="text"
                value={content} // TODO: Add the default prompt here
                onChange={changeContentSample}
                as="textarea"
                rows={4}
                isInvalid={content === ""}
                {...props}
            />

            <Form.Control.Feedback type="invalid">
                {onContentErrorMessage}
            </Form.Control.Feedback>
        </Col>

        {/* Response */}
        {showResponse ?
            <>
                <Col xs={12}>
                    <Form.Label>
                        <h6>Response</h6>
                    </Form.Label>
                    <Form.Control
                        type="text"
                        as={"textarea"}
                        value={response ?? ""}
                        onChange={(e) => { }}
                    />
                </Col>
                <Col xs={12} className="mb-6">
                    {/* <hr className="" /> */}
                </Col>
            </>

            : null}
    </Row>
}

interface DataModelPromptsProps {
    modelType: ModelType,
    host?: string,
    port?: string,
    api_key?: string,
    modelName: string,
    summaryPrompt: string,
    setSummaryPrompt: (v: string) => void,
    // summaryValidation: () => void,
    // summaryValidated: boolean,
    // setSummaryValidated: (v: boolean) => void,
    bulletPointPrompt: string,
    setBulletPointPrompt: (v: string) => void,
    // bulletPointValidation: () => boolean,
    topicNamePrompt: string,
    setTopicNamePrompt: (v: string) => void,
    // topicNameValidation: () => boolean,
    defaultPrompts: LLMPrompts,
}

export function DataModelPrompts({
    modelType,
    host,
    port,
    api_key,
    modelName,
    summaryPrompt,
    setSummaryPrompt,
    // summaryValidation,
    // summaryValidated,
    // setSummaryValidated,
    bulletPointPrompt,
    setBulletPointPrompt,
    // bulletPointValidation,
    topicNamePrompt,
    setTopicNamePrompt,
    // topicNameValidation,
    defaultPrompts,
}: DataModelPromptsProps) {
    // 'use server'
    const defaultTopicNamePromptContent = "politics, canada, immigration, refugees, economy"
    const iconProps = { size: 20 }
    const overlayProps = { delay: { show: 250, hide: 400 } }

    const [validating, setValidating] = useState<boolean>(false)
    const [validatingSummary, setValidatingSummary] = useState<boolean>(false)
    const [validatingTopicName, setValidatingTopicName] = useState<boolean>(false)
    const [validatingBulletPoint, setValidatingBulletPoint] = useState<boolean>(false)
    const [allValidated, setAllValidated] = useState<boolean>(false)
    const [validateAllEnabled, setValidateAllEnabled] = useState<boolean>(false)

    const [summaryValidated, setSummaryValidated] = useState<boolean>(false)
    const [summaryContent, setSummaryContent] = useState<string>(sampleArticles[0])
    const [summaryResponse, setSummaryResponse] = useState<string | null>(null)


    const [bulletPointValidated, setBulletPointValidated] = useState<boolean>(false)
    const [bulletPointContent, setBulletPointContent] = useState<string>(JSON.stringify(sampleArticles, null, 2))
    const [bulletPointResponse, setBulletPointResponse] = useState<string | null>(null)


    const [topicNameValidated, setTopicNameValidated] = useState<boolean>(false)
    const [topicNameContent, setTopicNameContent] = useState<string>(defaultTopicNamePromptContent)
    const [topicNameResponse, setTopicNameResponse] = useState<string | null>(null)

    // Default prompts
    const [defaultSummaryPrompt, setDefaultSummaryPrompt] = useState<string>(
        modelName in defaultPrompts ? defaultPrompts[modelName]['prompt'] : defaultPrompts.default.prompt
    )
    const [defaultBulletPointPrompt, setDefaultBulletPointPrompt] = useState<string>(
        modelName in defaultPrompts ? defaultPrompts[modelName]['bulletPoint'] : defaultPrompts.default.bulletPoint
    )
    const [defaultTopicNamePrompt, setDefaultTopicNamePrompt] = useState<string>(
        modelName in defaultPrompts ? defaultPrompts[modelName]['topicName'] : defaultPrompts.default.topicName
    )

    function summaryValidation() {
        setSummaryValidated(false)
        setSummaryResponse(null)
        setValidatingSummary(true)
        async function asyncSummaryValidation() {
            try {
                const response = await fetch(
                    '/config/summary',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            host: host,
                            port: port,
                            api_key: api_key,
                            prompt: summaryPrompt,
                            model_type: modelName,
                            articles: [summaryContent],
                            max_tokens: 512,
                        })
                    }
                )
                if (!response.ok) {
                    setSummaryValidated(false)
                    setSummaryResponse("Failed retrieving response.")
                    return
                }
                const reader = response.body!.getReader()
                const decoder = new TextDecoder()
                for (; ;) {
                    const { done, value } = await reader.read()
                    if (done) {
                        break
                    }
                    const chunk = JSON.parse(decoder.decode(value))
                    if (chunk.status === "success") {
                        setSummaryResponse(chunk.message)
                        setSummaryValidated(true)
                    } else if (chunk.status === "waiting") {
                        setSummaryResponse(chunk.message)
                    } else {
                        setSummaryResponse(JSON.stringify(chunk.message))
                        setSummaryValidated(false)
                    }
                }
            } catch (error) {
                setSummaryResponse("Error occured while retrieving response.")
                setSummaryValidated(false)
            } finally {
                setValidatingSummary(false) // TODO remove
            }
        }
        asyncSummaryValidation()
    }

    function bulletPointValidation() {
        setBulletPointValidated(false)
        setBulletPointResponse(null)
        setValidatingBulletPoint(true)
        async function asyncBulletPointValidation() {
            try {
                const response = await fetch(
                    '/config/bulletpoint',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            host: host,
                            port: port,
                            api_key: api_key,
                            prompt: bulletPointPrompt,
                            model_type: modelName,
                            articles: [bulletPointContent],
                            max_tokens: 512,
                        })
                    }
                )
                if (!response.ok) {
                    setBulletPointValidated(false)
                    setBulletPointResponse("Failed retrieving response.")
                    return
                }
                const reader = response.body!.getReader()
                const decoder = new TextDecoder()
                for (; ;) {
                    const { done, value } = await reader.read()
                    if (done) {
                        break
                    }
                    const chunk = JSON.parse(decoder.decode(value))
                    if (chunk.status === "success") {
                        setBulletPointResponse(chunk.message)
                        setBulletPointValidated(true)
                    } else if (chunk.status === "waiting") {
                        setBulletPointResponse(chunk.message)
                    } else {
                        setBulletPointResponse(JSON.stringify(chunk.message))
                        setBulletPointValidated(false)
                    }
                }
            } catch (error) {
                setBulletPointResponse("Error occured while retrieving response.")
                setBulletPointValidated(false)
            } finally {
                setValidatingBulletPoint(false) // TODO remove
            }
        }
        asyncBulletPointValidation()
    }

    function topicNameValidation() {
        setTopicNameValidated(false)
        setTopicNameResponse(null)
        setValidatingTopicName(true)
        async function asyncTopicNameValidation() {
            try {
                const response = await fetch(
                    '/config/topicname',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            host: host,
                            port: port,
                            api_key: api_key,
                            prompt: topicNamePrompt,
                            model_type: modelName,
                            keywords: topicNameContent.split(",").map(v => v.trim()),
                            max_tokens: 512,
                        })
                    }
                )
                if (!response.ok) {
                    setTopicNameValidated(false)
                    setTopicNameResponse("Failed retrieving response.")
                    return
                }
                const reader = response.body!.getReader()
                const decoder = new TextDecoder()
                for (; ;) {
                    const { done, value } = await reader.read()
                    if (done) {
                        break
                    }
                    const chunk = JSON.parse(decoder.decode(value))
                    if (chunk.status === "success") {
                        setTopicNameResponse(chunk.message)
                        setTopicNameValidated(true)
                    } else if (chunk.status === "waiting") {
                        setTopicNameResponse(chunk.message)
                    } else {
                        setTopicNameResponse(JSON.stringify(chunk.message))
                        setTopicNameValidated(false)
                    }
                }
            } catch (error) {
                setBulletPointResponse("Error occured while retrieving response.")
                setBulletPointValidated(false)
            } finally {
                setValidatingTopicName(false) // TODO remove
            }

        }
        asyncTopicNameValidation()
    }

    useEffect(() => {
        setValidating(
            Array.from(
                [validatingSummary, validatingBulletPoint, validatingTopicName]
            ).some((v) => v)
        )
    }, [validatingSummary, validatingBulletPoint, validatingTopicName])

    // Enable validation of prompts only when all prompts and content are filled
    useEffect(() => {

        if (validating) {
            setValidateAllEnabled(false)
        } else {
            setValidateAllEnabled([
                summaryPrompt,
                summaryContent,
                bulletPointPrompt,
                bulletPointContent,
                topicNamePrompt,
                topicNameContent,
            ].filter(v => v === "").length === 0)
        }

    }, [
        validating,
        summaryPrompt,
        summaryContent,
        bulletPointPrompt,
        bulletPointContent,
        topicNamePrompt,
        topicNameContent])

    // Validate all prompts
    function validateAll() {
        setSummaryValidated(false)
        setBulletPointValidated(false)
        setTopicNameValidated(false)
        if (validateAllEnabled) {
            summaryValidation()
            topicNameValidation()
            bulletPointValidation()
        }
    }

    useEffect(() => {
        const variables = [
            summaryValidated,
            bulletPointValidated,
            topicNameValidated,
        ]
        if (variables.filter(v => !v).length === 0) {
            setAllValidated(true)
        } else {
            setAllValidated(false)
        }
    }, [summaryValidated, bulletPointValidated, topicNameValidated])


    // Update default prompts depending on the model type and model name
    useEffect(() => {
        if (modelType === "Personalized") {
            setDefaultSummaryPrompt(modelName in defaultPrompts ? defaultPrompts[modelName]['summary'] : defaultPrompts.default.summary)
            setDefaultBulletPointPrompt(modelName in defaultPrompts ? defaultPrompts[modelName]['bulletPoint'] : defaultPrompts.default.bulletPoint)
            setDefaultTopicNamePrompt(modelName in defaultPrompts ? defaultPrompts[modelName]['topicName'] : defaultPrompts.default.topicName)
        } else if (modelType === "ChatGPT") {
            setDefaultSummaryPrompt('chatgpt' in defaultPrompts ? defaultPrompts['chatgpt']['summary'] : defaultPrompts.default.summary)
            setDefaultBulletPointPrompt('chatgpt' in defaultPrompts ? defaultPrompts['chatgpt']['bulletPoint'] : defaultPrompts.default.bulletPoint)
            setDefaultTopicNamePrompt('chatgpt' in defaultPrompts ? defaultPrompts['chatgpt']['topicName'] : defaultPrompts.default.topicName)
        }
    }, [modelType,
        modelName,
        defaultPrompts])

    return <Col xl={12} md={12} xs={12}>
        <Col xs={12}>
            <hr className="mb-4" />
        </Col>
        <Row xs={12} className="mb-3">
            <Col className="d-flex gap-2">
                <Form.Label as={Col} md={4} htmlFor="default">
                    <h3>
                        Prompts
                    </h3>
                </Form.Label>
                <OverlayTrigger
                    overlay={<Tooltip>Validate all prompts</Tooltip>}
                    {...overlayProps}
                >
                    {validateAllEnabled ?
                        <BugFill
                            color={allValidated ? "green" : "red"}
                            {...iconProps}
                            onClick={validateAll}
                        />
                        : <BugFill
                            color={"gray"}
                            {...iconProps}
                        />
                    }

                </OverlayTrigger>
                {/* <Tooltip title="Validate all prompts">
                    <Bug
                        className="pl-3"
                        color={allValidated ? "green" : "red"}
                        {...iconProps} />
                </Tooltip> */}
            </Col>
            <Col className="d-flex justify-content-end">

            </Col>
        </Row>

        <DataModelPrompt
            label="Summary"
            modelName={modelName}
            onValidation={summaryValidation}
            validated={summaryValidated}
            setValidated={setSummaryValidated}
            validating={validating}
            prompt={summaryPrompt}
            setPrompt={setSummaryPrompt}
            defaultPrompt={defaultSummaryPrompt}
            content={summaryContent}
            setContent={setSummaryContent}
            defaultContent={sampleArticles[0]}
            response={summaryResponse}
            onPromptErrorMessage="Summary prompt is required."
            onContentErrorMessage="Content sample is required. Expected a string with one News article."
            props={{ ...iconProps }}
        />

        <DataModelPrompt
            label="Bullet point summary"
            modelName={modelName}
            onValidation={bulletPointValidation}
            validated={bulletPointValidated}
            setValidated={setBulletPointValidated}
            validating={validating}
            prompt={bulletPointPrompt}
            setPrompt={setBulletPointPrompt}
            defaultPrompt={defaultBulletPointPrompt}
            content={bulletPointContent}
            setContent={setBulletPointContent}
            defaultContent={JSON.stringify(sampleArticles, null, 2)}
            response={bulletPointResponse}
            onPromptErrorMessage="Bullet point prompt is required."
            onContentErrorMessage="Content sample is required. Expected a string with one News article."
            props={{ ...iconProps }}
        />

        <DataModelPrompt
            label="Topic Name"
            modelName={modelName}
            onValidation={topicNameValidation}
            validated={topicNameValidated}
            setValidated={setTopicNameValidated}
            validating={validating}
            prompt={topicNamePrompt}
            setPrompt={setTopicNamePrompt}
            defaultPrompt={defaultTopicNamePrompt}
            content={topicNameContent}
            setContent={setTopicNameContent}
            defaultContent={defaultTopicNamePromptContent}
            response={topicNameResponse}
            onPromptErrorMessage="Topic name prompt is required."
            onContentErrorMessage="Topic name is required. Expected a comma separated list of names."
            props={{ ...iconProps }}
        />
    </Col>
}

export default function DataModel({
    dataModelPersonalized,
    dataModelChatGPT,
    dataModelPrompts }: DataModelProps) {
    // console.log("Selected ", dataModelPrompts.modelName)
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
                        defaultPrompts={dataModelPersonalized.defaultPrompts}
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
                        defaultPrompts={dataModelChatGPT.defaultPrompts}
                    />

                    <DataModelPrompts
                        modelType={dataModelPrompts.modelType}
                        host={dataModelPrompts.host}
                        port={dataModelPrompts.port}
                        api_key={dataModelPrompts.api_key}
                        modelName={dataModelPrompts.modelName}
                        summaryPrompt={dataModelPrompts.summaryPrompt}
                        setSummaryPrompt={dataModelPrompts.setSummaryPrompt}

                        bulletPointPrompt={dataModelPrompts.bulletPointsPrompt}
                        setBulletPointPrompt={dataModelPrompts.setBulletPointsPrompt}

                        topicNamePrompt={dataModelPrompts.topicNamePrompt}
                        setTopicNamePrompt={dataModelPrompts.setTopicNamePrompt}
                        defaultPrompts={dataModelPrompts.defaultPrompts}
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

                    {/* Number of articles per model Iteration */}
                    <Row className="mb-3">
                        <Col xl={3} lg={3} md={3} xs={12} className="mb-3 mb-lg-0">
                            <OverlayTrigger overlay={
                                <Tooltip>
                                    <p>
                                        The maximum number of articles to be classified per model iteration. </p>
                                </Tooltip>
                            }>
                                <Form.Label>
                                    <h5>
                                        Maximum # of articles per Model Iteration <span style={{ color: "red" }}>*</span>
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
                                        id="max_articles_per_model_iteration"
                                        value={props.maxArticlesPerModelIteration}
                                        onChange={(e) => props.setMaxArticlesPerModelIteration(e.target.value)}
                                        isInvalid={Number(props.maxArticlesPerModelIteration) < 2000}
                                        min={2000}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        The interval should be greater or equal to 2000 articles.
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
