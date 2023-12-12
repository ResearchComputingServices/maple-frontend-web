"use client";

// import node module libraries
import { Col, Row, Card, ListGroup } from "react-bootstrap";

const TopicList = () => {
  const topicList = ["Topic 1", "Topic 2", "Topic 3", "Topic 4"];

  return (
    <Row className="mt-4">
      <Col md={12} xs={12}>
        <Card>
          <Card.Header className="py-4 card-header-bg-gray">
            <h4 className="mb-0">List of Topics</h4>
          </Card.Header>
          <Card.Body>
            {/* <Card.Title>Topic List</Card.Title> */}
            <Card.Text>
              <Col md={12} xs={12}>
                <ListGroup>
                  <ListGroup.Item>Cras justo odio</ListGroup.Item>
                  <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                  <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                  <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                  <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                </ListGroup>
              </Col>
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default TopicList;
