'use client'

import { useAppContext } from 'provider/AppProvider'

// import node module libraries
import { Col, Row, Card, Image } from 'react-bootstrap'
import { useEffect, createRef } from 'react'
import * as d3 from 'd3'

const ProjectHighlight = ({ width, height }) => {
  const { lineChart } = useAppContext()
  const ref = createRef()

  useEffect(() => {
    console.log('>>>>>>>>>>>>>>>>lineChart', lineChart)
    draw()
  })

  const draw = () => {
    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 20, bottom: 30, left: 40 },
      width = 600 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom
    // append the svg object to the body of the page
    const svg = d3.select(ref.current)
    svg.selectAll('*').remove()
    svg
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    //Read the data
    if (lineChart != 'Loading') {
      // Add X axis
      const x = d3.scaleBand()
        .range([0, width])
        .domain(
          lineChart.map(function (d) {
            return d.date
          }),
        )
        .padding(0.2)
      svg
        .append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x))
        // .selectAll('text')
        // .attr('transform', 'translate(-10,0)rotate(-45)')
        // .style('text-anchor', 'end')

      // Add Y axis
      const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(lineChart, function (d) {
          return d.count;
        })]);
      svg.append('g').call(d3.axisRight(y))

      // Add Y axis
      // const y = d3.scaleLinear().domain([0, 50]).range([height, 0])
      // svg.append('g').call(d3.axisLeft(y))

      // Bars
      svg
        .selectAll('.bar')
        .data(lineChart)
        .enter()
        .append('rect')
        .attr("class", "bar")
        .attr('x', function (d) {
          return x(d.date)
        })
        .attr("width", x.bandwidth())
        .attr('y', function (d) {
          return y(d.count)
        })
        .attr('height', function (d) {
          return height - y(d.count)
        })
        .attr('fill', '#69b3a2')
    }
  }

  return (
    <Row className='mt-4'>
      <Col md={12} xs={12}>
        <Card>
          <Card.Header className='py-4 card-header-bg-gray'>
            <h4 className='mb-0'>Project Highlight</h4>
          </Card.Header>
          <Card.Body>
            <Col md={12} xs={12}>
              <svg width={width} height={height} ref={ref} />
            </Col>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default ProjectHighlight
