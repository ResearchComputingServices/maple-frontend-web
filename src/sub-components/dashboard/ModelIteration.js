'use client'
import { useAppContext } from 'provider/AppProvider'
import { Col, Row, Form, Card, ListGroup } from 'react-bootstrap'

const ModelIteration = () => {
  const { modelIteration } = useAppContext()
  return (
    <Row className='mt-4'>
      <Col md={12} xs={12}>
        <Card>
          <Card.Header className='py-4 card-header-bg-gray'>
            <h4 className='mb-0'>Data Model Version</h4>
          </Card.Header>
          <Card.Body>
            <Card.Text>
              <Col md={12} xs={12}>
                <ListGroup>
                  {modelIteration.map((item, index) => {
                    return <ListGroup.Item style={{"background-color": item.bgcolor}}>{item.label}</ListGroup.Item>
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

export default ModelIteration
