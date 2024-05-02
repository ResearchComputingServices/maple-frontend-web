'use client'

import {useAppContext} from 'provider/AppProvider'
import { Col, Row, Card } from 'react-bootstrap'

const TopicArticle = () => {
  const {articleSummary} = useAppContext()

  return (
    <Row className='mt-4'>
      <Col md={12} xs={12}>
        <Card>
          <Card.Header className='py-4 card-header-bg-gray'>
            <h4 className='mb-0'>Article Summary</h4>
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
  )
}

export default TopicArticle
