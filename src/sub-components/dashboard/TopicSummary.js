'use client'

import {useAppContext} from 'provider/AppProvider'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { fetcher } from 'app/_helpers'

// import node module libraries
import { Col, Row, Card } from 'react-bootstrap'

const TopicSummary = props => {
  const {topicSummary} = useAppContext()
  if (topicSummary != 'Loading') {
    return (
      <Row className='mt-4'>
      {topicSummary.map((item, index) => {
        return (
          <Col md={2} xs={2} key={index}>
            <Card>
              <Card.Header className='py-4 card-header' style={{"background-color": item.bgcolor}}>
                <h4 className='mb-0'>{item.label}</h4>
              </Card.Header>
              <Card.Body>
                <Card.Text>
                  <Col md={12} xs={12}>
                    {item.summary.map((item2, index2) => {
                      return ( 
                      <ul key={index2}>
                        <li>{item2.replaceAll('-', '')}</li>
                      </ul>)
                    })}
                  </Col>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )
      })}
        <Col md={2} xs={2}>
          <Card>
            <Card.Header className='py-4 card-header' style={{"background-color": "#E0E0E0"}}>
              <h4 className='mb-0'>News Source</h4>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <Col md={12} xs={12}>
                  <ul>
                    <li>CBC News</li>
                    <li>CTV News</li>
                  </ul>
                </Col>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    )
  }
  
}

export default TopicSummary
