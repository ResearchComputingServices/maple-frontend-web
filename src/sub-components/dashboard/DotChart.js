"use client";

// import node module libraries
import { Col, Row, Card, Image } from "react-bootstrap";

const DotChart = () => {
  return (
    <Row className="mt-4">
      <Col md={12} xs={12}>
        <Card>
          <Card.Header className="py-4 card-header-bg-gray">
            <h4 className="mb-0">Scattered Plot</h4>
          </Card.Header>
          <Card.Body>
            <Col md={12} xs={12}>
              <h3>Plot</h3>
              <Image
                src="/images/layouts/dotchart.png"
                alt=""
                style={{ maxWidth: "100%" }}
              />
            </Col>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default DotChart;
