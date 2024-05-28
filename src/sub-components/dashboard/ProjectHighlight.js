'use client'

import { useAppContext } from 'provider/AppProvider'

// import node module libraries
import { Col, Row, Card, Image } from 'react-bootstrap'
import { useEffect, createRef } from 'react'
import * as d3 from 'd3'

// helper function
function getDate(d) {
  return new Date(d);
}

const parseDate = d3.utcParse("%Y-%m-%d");

const ProjectHighlight = ({ width, height }) => {
  let { lineChart } = useAppContext()
  const ref = createRef()

  useEffect(() => {
    // console.log('>>>>>>>>>>>>>>>>lineChart', lineChart)
    draw()
  })

  const draw = () => {
    // set the dimensions and margins of the graph
    const margin = {top: 25, right: 35, bottom: 25, left: 35, padd: 15};
    const fullWidth = 1100;
    const fullHeight = 220;
    const width = fullWidth - margin.left - margin.right;
    const height = fullHeight - margin.bottom - margin.top;
    // append the svg object to the body of the page
    const svg = d3.select(ref.current)
    svg.selectAll('*').remove()
    svg
      .append('svg')
      .attr('width', fullWidth)
      .attr('height', fullHeight)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    //Read the data
    if (lineChart != 'Loading') {
      lineChart.forEach(function(d) {
        d.date = parseDate(d.date);
        // console.log(d.date)
        return d;
      })

      // Add X axis
      // let minDate = getDate(lineChart[0]['date']), 
      // maxDate = getDate(lineChart[lineChart.length-1]['date']),
      // padding = (maxDate - minDate) * .1;
      let minDate = d3.min(lineChart, function(d) { 
        return d.date.getTime(); 
      }),
      maxDate = d3.max(lineChart, function(d) { 
        return d.date.getTime(); 
      }),
      padding = (maxDate - minDate) * .1;
      console.log('minDate, maxdate', minDate, maxDate)
      const x = d3.scaleTime()
        .rangeRound([0, width])
        .domain(
          [minDate - padding, maxDate + padding]
        );
      const xAxis = d3.axisBottom(x)
        .tickSizeOuter(0)
        .tickFormat(d3.timeFormat("%b"));
        
      svg
        .append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
        // .selectAll('text')
        // .attr('transform', 'translate(-10,0)rotate(-45)')
        // .style('text-anchor', 'end')
      svg
        .append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + 30) + ")")
        .style("text-anchor", "middle")
        .text("Month");

      // Add Y axis
      const y = d3.scaleLinear()
        .range([height, 0])
        .domain([
          d3.min(lineChart, function (d) {return d.count}) -2, 
          d3.max(lineChart, function (d) {return d.count;}) +1
        ]);
      const yAxis = d3.axisRight(y);
      svg.append('g').call(yAxis)
      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Count");

      // Bars
      svg
        .selectAll('.bar')
        .data(lineChart)
        .enter()
        .append('rect')
        .attr("class", "bar")
        .attr('x', function (d) {
          return x(d.date) - margin.padd
        })
        .attr('width', 2.5)
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
            <h4 className='mb-0'>Topic Evolution</h4>
          </Card.Header>
          <Card.Body>
            <Col md={12} xs={12} className='m-2'>
              <svg width={width} height={height} ref={ref} />
            </Col>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default ProjectHighlight
