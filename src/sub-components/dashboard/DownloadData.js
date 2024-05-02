'use client'

// import node module libraries
import { Col, Row, Card, Button } from 'react-bootstrap'

const DownloadData = () => {
  return (
    <Row className='mt-4'>
      <Col md={12} xs={12}>
        <Card className='text-center'>
          <Card.Body>
            <Button variant='primary'> Download Data </Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default DownloadData
