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
                        <ModelType />
                        <ModelIteration />
                        <TopicList />
                        <TopicArticle />
                    </Col>
                    <Col xl={6} lg={6} md={6} xs={12} className='mb-2'>
                        <DotChart width="640" height="420"/>
                    </Col>
                    <Col xl={3} lg={3} md={3} xs={12} className='mb-2'>
                        <ProjectHighlight width="300" height="100"/>
                        <TopicSummary />
                        <DownloadData />
                    </Col>
                </Row>
            </div>
        </Container>
    )
}

export default Home
