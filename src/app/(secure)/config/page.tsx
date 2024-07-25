'use client';

import React, { Fragment, useState, useEffect, useRef } from "react";
import { Row, Col, Card, Form, Modal, Button, Container } from "react-bootstrap";
import Link from 'next/link';
import axios from "axios";
import qs from "qs";
import { useForm } from 'react-hook-form';
import { NavbarTop2 } from 'app/_components/navbars';

const baseApiUrl = process.env.PATH_URL_BACKEND_REMOTE;
const configEndpoint = "/config";

let didInit = false;

const Config = () => {

    // Radio button
    const [modelTypeRadio, setModelTypeRadio] = useState("");
    const handleChangeRadio = (event: any) => {
        setModelTypeRadio(event.target.value);
        // console.log(event.target.value);
    };

    // ChatGPT Name
    const [gptName, setGptName] = useState("");
    const handleChangeGptName = (event: any) => {
        setGptName(event.target.value);
        // console.log(event.target.value);
    };

    // ChatGPT API Key
    const [gptApiKey, setGptApiKey] = useState("");
    const handleChangeGptApiKey = (event: any) => {
        setGptApiKey(event.target.value);
        // console.log(event.target.value);
    };

    // Personalized Model Name
    const [personalizedName, setPersonalizedName] = useState("");
    const handleChangePersonalizedName = (event: any) => {
        setPersonalizedName(event.target.value);
        // console.log(event.target.value);
    };

    // Personalized API Key
    const [personalizedApiKey, setPersonalizedApiKey] = useState("");
    const handleChangePersonalizedApiKey = (event: any) => {
        setPersonalizedApiKey(event.target.value);
        // console.log(event.target.value);
    };

    // Personalized Host
    const [personalizedHost, setPersonalizedHost] = useState("");
    const handleChangePersonalizedHost = (event: any) => {
        setPersonalizedHost(event.target.value);
        // console.log(event.target.value);
    };

    // Personalized port
    const [personalizedPort, setPersonalizedPort] = useState("");
    const handleChangePersonalizedPort = (event: any) => {
        setPersonalizedPort(event.target.value);
        // console.log(event.target.value);
    };

    // Article Summary Length
    const [summaryLen, setsummaryLen] = useState("");
    const handleChangeSummaryLen = (event: any) => {
        setsummaryLen(event.target.value);
        // console.log(event.target.value);
    };

    // Max Bullet Point
    const [maxBulletPoint, setmaxBulletPoint] = useState("");
    const handleChangeMaxBulletPoint = (event: any) => {
        setmaxBulletPoint(event.target.value);
        // console.log(event.target.value);
    };

    // reset button
    const onButtonClickReset = () => {
        setModelTypeRadio("");
        setGptName("");
        setGptApiKey("");
        setPersonalizedName("");
        setPersonalizedApiKey("");
        setPersonalizedHost("");
        setPersonalizedPort("");
        setsummaryLen("");
        setmaxBulletPoint("");
    };

    // ==== Post Config Details ====
    const onButtonClickUpdateConfig = async () => {

        // TODO perform sanity check
        const rcSanityCheck = sanityCheck();
        // console.log(rcSanityCheck);
        if (rcSanityCheck) {
            const address = `${baseApiUrl}${configEndpoint}`;
            let modelObj;
            if (rcSanityCheck["model_type"] == "CHATGPT") {
                modelObj = {
                    name: "ChatGPT",
                    config: {
                        api_key: rcSanityCheck["key"]
                    }
                }
            } else if (rcSanityCheck["model_type"] == "PERSONALIZED") {
                modelObj = {
                    name: "Personalized",
                    config: {
                        host: rcSanityCheck["host"],
                        port: rcSanityCheck["port"],
                        api_key: rcSanityCheck["key"]
                    }
                }
            }
            try {
                const data = {
                    model: modelObj,
                    article_summary_length: parseInt(rcSanityCheck["summary_len"], 10),
                    max_bullet_points: parseInt(rcSanityCheck["max_bullet"], 10),
                };
                const options = {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        "Accept": "application/json"
                      },
                    data: data,
                    url: address,
                };
                const resp = await axios(options);

                console.log("DEBUG Axios:", resp.data);
                setShowModalSubmit(true);
                onButtonClickReset();
            } catch (err) {
                console.log("ERR Axios:", err);
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
    const [modalWarningMessage, setModalWarningMessage] = useState("");
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
                    <p>{modalWarningMessage}</p>
                </Modal.Body>
            </Modal>
        );
    };

    function sanityCheck() {
        let rcObj = {
            model_type: "",
            name: "",
            key: "",
            host: "",
            port: "",
            summary_len: "",
            max_bullet: ""
        };

        if (modelTypeRadio != "") {
            if (modelTypeRadio == "CHATGPT") {
                if (gptName != "") {
                    rcObj["model_type"] = "CHATGPT";
                    rcObj["name"] = gptName;
                } else {
                    setModalWarningMessage("Please provide config name for ChatGPT Model");
                    setShowModalWarning(true);
                    return false;
                }
                if (gptApiKey != "") {
                    rcObj["model_type"] = "CHATGPT";
                    rcObj["key"] = gptApiKey;
                } else {
                    setModalWarningMessage("Please provide API Key for ChatGPT");
                    setShowModalWarning(true);
                    return false;
                }
            } else if (modelTypeRadio == "PERSONALIZED") {
                if (personalizedName != "") {
                    rcObj["model_type"] = "PERSONALIZED";
                    rcObj["name"] = personalizedName;
                } else {
                    setModalWarningMessage("Please provide config name for Personalized Model");
                    setShowModalWarning(true);
                    return false;
                }
                if (personalizedHost != "") {
                    rcObj["model_type"] = "PERSONALIZED";
                    rcObj["host"] = personalizedHost;
                } else {
                    setModalWarningMessage("Please provide Host IP for Personalized Model");
                    setShowModalWarning(true);
                    return false;
                }
                if (personalizedPort != "") {
                    rcObj["model_type"] = "PERSONALIZED";
                    rcObj["port"] = personalizedPort;
                } else {
                    setModalWarningMessage("Please provide Host Port for Personalized Model");
                    setShowModalWarning(true);
                    return false;
                }
                if (personalizedApiKey != "") {
                    rcObj["model_type"] = "PERSONALIZED";
                    rcObj["key"] = personalizedApiKey;
                } else {
                    setModalWarningMessage("Please provide API Key for Personalized Model");
                    setShowModalWarning(true);
                    return false;
                }
            } else {
                setModalWarningMessage("Unknown data model option type!");
                setShowModalWarning(true);
                return false;
            }
        } else {
            setModalWarningMessage("Select at least one data model type!");
            setShowModalWarning(true);
            return false;
        }

        if (summaryLen != "") {
            rcObj["summary_len"] = summaryLen;
        } else {
            setModalWarningMessage("Please provide article summary length");
            setShowModalWarning(true);
        }

        if (maxBulletPoint != "") {
            rcObj["max_bullet"] = maxBulletPoint;
        } else {
            setModalWarningMessage("Please provide maximum bullet points");
            setShowModalWarning(true);
        }

        return rcObj;
    }

    return (
        <div>
            <div className='header'>
                <NavbarTop2 />
            </div>
            <Container fluid className='p-2'>
                <div className='p-2'>
                    <Row className="align-items-center justify-content-center g-0">

                        <Col xxl={8} lg={8} md={8} xs={12} className="py-8 py-xl-0">
                            <Card>
                                <Card.Header className="p-4 bg-white">
                                    <h4 className="mb-0">Data Model Configuration Parameters</h4>
                                </Card.Header>

                                <Card.Body>
                                    <Row className="align-items-center">
                                        <Col xl={12} md={12} xs={12} className="mb-3">
                                            <Row>
                                                <Col xl={12} md={12} xs={12}>
                                                    <Form.Label as={Col} md={4} htmlFor="default">
                                                        <h5>
                                                            Choose Data Model {" "}
                                                            <span style={{ color: "red" }}>*</span>
                                                        </h5>
                                                    </Form.Label>
                                                </Col>
                                                <Col xs={12}>
                                                    <hr className="mb-4" />
                                                </Col>

                                                <Col xl={12} md={12} xs={12}>
                                                    <Row className="mb-3">
                                                        <Col xl={1} lg={2} md={2} xs={12} className="mb-3 mb-lg-0">
                                                            <Form.Check.Input
                                                                type="radio"
                                                                name="modelInputRadio"
                                                                value="CHATGPT"
                                                                onChange={handleChangeRadio}
                                                                checked={modelTypeRadio === "CHATGPT"}
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
                                                                API Key Name{" "}
                                                            </Form.Label>
                                                        </Col>
                                                        <Col xl={6} lg={6} md={6} xs={12} className="mb-3 mb-lg-0">
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Enter API Key Name"
                                                                id="gptName"
                                                                value={gptName}
                                                                onChange={handleChangeGptName}
                                                            />
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
                                                                value={gptApiKey}
                                                                onChange={handleChangeGptApiKey}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xs={12}>
                                                    <hr className="mb-4" />
                                                </Col>

                                                <Col xl={12} md={12} xs={12}>
                                                    <Row className="mb-3">
                                                        <Col xl={1} lg={2} md={2} xs={12} className="mb-3 mb-lg-0">
                                                            <Form.Check.Input
                                                                type="radio"
                                                                name="modelInputRadio"
                                                                value="PERSONALIZED"
                                                                onChange={handleChangeRadio}
                                                                checked={modelTypeRadio === "PERSONALIZED"}
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
                                                        <Col xl={3} lg={3} md={3} xs={12} className="mb-3 mb-lg-0">
                                                        </Col>
                                                        <Col xl={3} lg={3} md={3} xs={12} className="mb-3 mb-lg-0">
                                                            <Form.Label>
                                                                API Key Name{" "}
                                                            </Form.Label>
                                                        </Col>
                                                        <Col xl={6} lg={6} md={6} xs={12} className="mb-3 mb-lg-0">
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Enter API Key Name"
                                                                id="personalizedName"
                                                                value={personalizedName}
                                                                onChange={handleChangePersonalizedName}
                                                            />
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
                                                                id="personalizedApiKey"
                                                                value={personalizedApiKey}
                                                                onChange={handleChangePersonalizedApiKey}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row className="mb-3">
                                                        <Col xl={3} lg={3} md={3} xs={12} className="mb-3 mb-lg-0">
                                                        </Col>
                                                        <Col xl={3} lg={3} md={3} xs={12} className="mb-3 mb-lg-0">
                                                            <Form.Label>
                                                                Host IP{" "}
                                                            </Form.Label>
                                                        </Col>
                                                        <Col xl={6} lg={6} md={6} xs={12} className="mb-3 mb-lg-0">
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Enter Host IP address"
                                                                id="personalizedHost"
                                                                value={personalizedHost}
                                                                onChange={handleChangePersonalizedHost}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row className="mb-3">
                                                        <Col xl={3} lg={3} md={3} xs={12} className="mb-3 mb-lg-0">
                                                        </Col>
                                                        <Col xl={3} lg={3} md={3} xs={12} className="mb-3 mb-lg-0">
                                                            <Form.Label>
                                                                Host Port{" "}
                                                            </Form.Label>
                                                        </Col>
                                                        <Col xl={6} lg={6} md={6} xs={12} className="mb-3 mb-lg-0">
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Enter Host Port Number"
                                                                id="personalizedPort"
                                                                value={personalizedPort}
                                                                onChange={handleChangePersonalizedPort}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>

                                            <Col xs={12}>
                                                <hr className="mb-4" />
                                            </Col>

                                            <Row className="mb-3">
                                                <Col xl={3} lg={3} md={3} xs={12} className="mb-3 mb-lg-0">
                                                    <Form.Label>
                                                        <h5>
                                                            Article Summary Length <span style={{ color: "red" }}>*</span>
                                                        </h5>
                                                    </Form.Label>
                                                </Col>
                                                <Col xl={9} lg={9} md={9} xs={12} className="mb-3 mb-lg-0">
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Article Summary Length"
                                                        id="summaryLen"
                                                        value={summaryLen}
                                                        onChange={handleChangeSummaryLen}
                                                    />
                                                </Col>
                                            </Row>

                                            <Col xs={12}>
                                                <hr className="mb-4" />
                                            </Col>

                                            <Row className="mb-3">
                                                <Col xl={3} lg={3} md={3} xs={12} className="mb-3 mb-lg-0">
                                                    <Form.Label>
                                                        <h5>
                                                            Max Bullet Points <span style={{ color: "red" }}>*</span>
                                                        </h5>
                                                    </Form.Label>
                                                </Col>
                                                <Col xl={9} lg={9} md={9} xs={12} className="mb-3 mb-lg-0">
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Max Bullet Points"
                                                        id="maxBulletPoint"
                                                        value={maxBulletPoint}
                                                        onChange={handleChangeMaxBulletPoint}
                                                    />
                                                </Col>
                                            </Row>

                                            <Col xs={12}>
                                                <hr className="mb-4" />
                                            </Col>


                                            <Col xs={12}>
                                                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                                    <Button variant="secondary" onClick={onButtonClickReset}>
                                                        Reset
                                                    </Button>
                                                    <Button variant="warning" onClick={onButtonClickReset}>
                                                        Cancel
                                                    </Button>
                                                    <Button variant="success" onClick={onButtonClickUpdateConfig}>
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
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>
    );
};

export default Config;
