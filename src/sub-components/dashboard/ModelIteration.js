"use client";

// import node module libraries
import { Col, Row, Form, Card } from "react-bootstrap";

// import widget as custom components
import { FormSelect } from "widgets";

const ModelIteration = () => {
  const modelIterationOptions = [
    { value: "Iteration1", label: "Iteration1" },
    { value: "Iteration2", label: "Iteration2" },
    { value: "Iteration3", label: "Iteration3" },
    { value: "Iteration4", label: "Iteration4" },
  ];

  return (
    <Row className="mt-4">
      <Col md={12} xs={12}>
        <Card>
          <Card.Header className="py-4 card-header-bg-gray">
            <h4 className="mb-0">Select Model Iteration</h4>
          </Card.Header>
          <Card.Body>
            <Card.Title>List of available model iterations:</Card.Title>
            <Card.Text>
              <Col md={12} xs={12}>
                <Form.Control
                  as={FormSelect}
                  placeholder="Select Iteration"
                  id="modelIteration"
                  options={modelIterationOptions}
                />
              </Col>
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ModelIteration;
