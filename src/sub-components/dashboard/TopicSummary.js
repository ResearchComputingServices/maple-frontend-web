'use client'

import {useAppContext} from 'provider/AppProvider'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { fetcher } from 'app/_helpers'

// import node module libraries
import { Col, Row, Card } from 'react-bootstrap'

const TopicSummary = props => {
  const {topicSummary} = useAppContext()

  return (
    <Row className='mt-4'>
      <Col md={12} xs={12}>
        <Card>
          <Card.Header className='py-4 card-header-bg-gray'>
            <h4 className='mb-0'>Topic Summary</h4>
          </Card.Header>
          <Card.Body>
            {/* <Card.Title>Article Summary</Card.Title> */}
            <Card.Text>
              <Col md={12} xs={12}>
                {topicSummary}
              </Col>
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default TopicSummary
