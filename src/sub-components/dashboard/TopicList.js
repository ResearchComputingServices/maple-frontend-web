'use client'

import { useAppContext } from 'provider/AppProvider'
import { Col, Row, Card, ListGroup } from 'react-bootstrap'

const TopicList = () => {
  const { topicList } = useAppContext()

  return (
    <Row className='mt-4'>
      <Col md={12} xs={12}>
        <Card>
          <Card.Header className='py-4 card-header-bg-gray'>
            <h4 className='mb-0'>Trending Topics</h4>
          </Card.Header>
          <Card.Body>
            {/* <Card.Title>Topic List</Card.Title> */}
            <Card.Text>
              <Col md={12} xs={12}>
                <ListGroup>
                  {/* <ListGroup.Item>Cras justo odio</ListGroup.Item>
                  <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                  <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                  <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                  <ListGroup.Item>Vestibulum at eros</ListGroup.Item> */}
                  {topicList.map((item, index) => {
                    return <ListGroup.Item variant={item.bgcolor}>{item.label}</ListGroup.Item>
                  })}
                </ListGroup>
              </Col>
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default TopicList
