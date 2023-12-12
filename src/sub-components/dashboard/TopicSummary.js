"use client";

// import node module libraries
import { Col, Row, Card } from "react-bootstrap";

const TopicSummary = () => {
  const articleSummary = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspen disse var ius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.";

  return (
    <Row className="mt-4">
      <Col md={12} xs={12}>
        <Card>
          <Card.Header className="py-4 card-header-bg-gray">
            <h4 className="mb-0">Topic Summary</h4>
          </Card.Header>
          <Card.Body>
            {/* <Card.Title>Article Summary</Card.Title> */}
            <Card.Text>
              <Col md={12} xs={12}>
                {articleSummary}
              </Col>
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default TopicSummary;
