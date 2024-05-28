'use client'
import { useEffect, useState } from 'react'
import { Col, Row, Container } from 'react-bootstrap'

import {
    DotChart,
    DownloadData,
    ModelIteration,
    ModelType,
    ProjectHighlight,
    TopicArticle,
    TopicList,
    TopicSummary,
} from 'sub-components'

const Home = () => {

    return (
        <Container fluid className='p-2'>
            {/* content */}
            <div className='p-2'>
                <Row>
                    <Col xl={3} lg={3} md={3} xs={12} className='mb-2'>
                        {/* <ModelType /> */}
                        {/* <ModelIteration /> */}
                        <TopicList />
                        <TopicSummary />
                        {/* <TopicArticle /> */}
                    </Col>
                    <Col xl={9} lg={9} md={9} xs={12} className='mb-2'>
                        <ProjectHighlight width="1400" height="220"/>
                        <DotChart width="1400" height="450"/>
                    </Col>
                    {/* <Col xl={3} lg={3} md={3} xs={12} className='mb-2'> */}
                        {/* <DownloadData /> */}
                    {/* </Col> */}
                </Row>
            </div>
        </Container>
    )
}

export default Home
