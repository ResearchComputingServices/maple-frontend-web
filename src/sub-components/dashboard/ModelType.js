'use client'

import {useAppContext} from 'provider/AppProvider'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { fetcher } from 'app/_helpers'
import axios from "axios";

// import node module libraries
import { Col, Row, Form, Card, ListGroup } from 'react-bootstrap'

// import widget as custom components
import { FormSelect } from 'widgets'

const ModelType = () => {

  const {modelType} = useAppContext()

  // const [modelTypeOptions, setModelTypeOptions] = useState([{ value: 'DEFAULT', label: 'Select Model' }])
  // const { data, error, isLoading } = useSWR(`/api`, fetcher)
  // useEffect(() => {
  //   if (data) {
  //     console.log("======>>>>>>>>>>", data.result)
  //     setModelTypeOptions(data.result)
  //   }
  // }, [data, isLoading])
  // if (error) return [{ value: 'DEFAULT', label: 'Select Model' }]
  // if (isLoading) return [{ value: 'DEFAULT', label: 'Select Model' }]
  // if (!data) return [{ value: 'DEFAULT', label: 'Select Model' }]

  return (
    <Row className='mt-4'>
      <Col md={12} xs={12}>
        <Card>
          <Card.Header className='py-4 card-header-bg-gray'>
            <h4 className='mb-0'>Topic Model</h4>
          </Card.Header>
          <Card.Body>
            <Card.Title>List of available model types:</Card.Title>
            <Card.Text>
              <Col md={12} xs={12}>
                {/* <Form.Control
                  as={FormSelect}
                  id='modelType'
                  options={modelType}
                  defaultselected='DEFAULT'
                /> */}
                <ListGroup>
                  {modelType.map((item, index) => {
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

export default ModelType
