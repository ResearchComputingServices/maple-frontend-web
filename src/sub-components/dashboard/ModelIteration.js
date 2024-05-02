'use client'

import { useAppContext } from 'provider/AppProvider'
import { Col, Row, Form, Card, ListGroup } from 'react-bootstrap'
import { FormSelect } from 'widgets'

const ModelIteration = () => {
  const { modelIteration } = useAppContext()

  return (
    <Row className='mt-4'>
      <Col md={12} xs={12}>
        <Card>
          <Card.Header className='py-4 card-header-bg-gray'>
            <h4 className='mb-0'>Model Iteration</h4>
          </Card.Header>
          <Card.Body>
            <Card.Title>List of available model iterations:</Card.Title>
            <Card.Text>
              <Col md={12} xs={12}>
                {/* <Form.Control
                  as={FormSelect}
                  id='modelIteration'
                  options={modelIteration}
                  defaultselected='DEFAULT'
                /> */}
                <ListGroup>
                  {modelIteration.map((item, index) => {
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

export default ModelIteration
