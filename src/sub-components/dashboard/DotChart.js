'use client'

import {useAppContext} from 'provider/AppProvider'

// import node module libraries
import { Col, Row, Card, Image } from 'react-bootstrap'
import { useEffect, createRef } from 'react'
import * as d3 from 'd3'

const DotChart = ({ width, height }) => {

  const {dotChart, allDots} = useAppContext()

  const ref = createRef()

  useEffect(() => {
    draw()
    console.log('>>>>>>>>>>>>>>>>dotChart', dotChart)
  })

  const draw = () => {
    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 30, bottom: 30, left: 100 },
      width = 600,
      height = 400
    // append the svg object to the body of the page
    const svg = d3.select(ref.current)
      svg.selectAll('*').remove()
      svg
      .append('svg')
      .attr('width', width )
      .attr('height', height )
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    //Read the data
    if(dotChart != "Loading" && allDots!= "Loading") {
      // Add X axis
      const x = d3.scaleLinear()
      .range([0, width])
      .domain(d3.extent(allDots, function (d) {
        return d.xPos;
      }));
      svg
        .append('g')
        .attr('class', 'myXaxis') // Note that here we give a class to the X axis, to be able to call it later and modify it
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .attr('opacity', '1')

      // Add Y axis
      const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(allDots, function (d) {
        return d.yPos;
      })]);
      svg.append('g').call(d3.axisRight(y))

      // Add dots
      svg
        .append('g')
        .selectAll('dot')
        .data(allDots)
        .enter()
        .append('circle')
        .attr('cx', function (d) {
          return x(d.xPos)
        })
        .attr('cy', function (d) {
          return y(d.yPos)
        })
        .attr('r', 4)
        .style('fill', function (d) {
          return d.color
        })

      // Add dots
      svg
        .append('g')
        .selectAll('dot')
        .data(dotChart)
        .enter()
        .append('circle')
        .attr('cx', function (d) {
          return x(d.xPos)
        })
        .attr('cy', function (d) {
          return y(d.yPos)
        })
        .attr('r', 4)
        .style('fill', function (d) {
          return d.color
        })
    }
  }

  return (
    <Row className='mt-4'>
      <Col md={12} xs={12}>
        <Card>
          <Card.Header className='py-4 card-header-bg-gray'>
            <h4 className='mb-0'>Scattered Plot</h4>
          </Card.Header>
          <Card.Body>
            <Col md={12} xs={12}>
              <h3>Plot</h3>
              {/* <Image
                src='/images/layouts/dotchart.png'
                alt=''
                style={{ maxWidth: '100%' }}
              /> */}
              <svg width={width} height={height} ref={ref} />
            </Col>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default DotChart
