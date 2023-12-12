"use client";

// import node module libraries
import { Col, Row, Form, Card } from "react-bootstrap";

// import widget as custom components
import { FormSelect } from "widgets";

const ModelType = () => {
  const modelTypeOptions = [
    { value: "DEFAULT", label: "Select Model" },
    { value: "BERTopic", label: "BERTopic" },
    { value: "LDA", label: "LDA" },
    { value: "Model3", label: "Model3" },
    { value: "Model4", label: "Model4" },
  ];

  return (
    <Row className="mt-4">
      <Col md={12} xs={12}>
        <Card>
          <Card.Header className="py-4 card-header-bg-gray">
            <h4 className="mb-0">Select a Topic Model</h4>
          </Card.Header>
          <Card.Body>
            <Card.Title>List of available model types:</Card.Title>
            <Card.Text>
              <Col md={12} xs={12}>
                <Form.Control
                  as={FormSelect}
                  id="modelType"
                  options={modelTypeOptions}
                  defaultselected="DEFAULT"
                />
              </Col>
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ModelType;
