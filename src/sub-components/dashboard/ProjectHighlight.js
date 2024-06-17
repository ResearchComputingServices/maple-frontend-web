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
    console.log('>>>>>>>>>>>>>>>>lineChart', lineChart)
    draw()
  })

  const draw = () => {
    // set the dimensions and margins of the graph
    const bgColorList = ["#FF8A65", "#FFD54F", "#AED581", "#4DD0E1", "#BA68C8"];
    const margin = {top: 20, right: 30, bottom: 20, left: 60, padd: 0};
    const fullWidth = 800;
    const fullHeight = 300;
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
      
      let minDate = d3.min(lineChart['linechart'], function(d) { 
        return d.date.getTime(); 
      }),
      maxDate = d3.max(lineChart['linechart'], function(d) { 
        return d.date.getTime(); 
      }),
      padding = (maxDate - minDate) * .1;

      // Add X axis
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
        .attr('transform', 'translate(' + margin.left + ',' + (height + 10) + ')')
        .call(xAxis)
      svg
        .append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + 40) + ")")
        .style("text-anchor", "middle")
        .text("Month");

      // Add Y axis
      const y = d3.scaleLinear()
        .range([height, 0])
        .domain([
          d3.min(lineChart['linechart'], function (d) {return d.count}) -5, 
          d3.max(lineChart['linechart'], function (d) {return d.count;}) +2
        ]);
      const yAxis = d3.axisLeft(y);
      svg
        .append('g')
        .attr("transform", "translate(" + (margin.left - 20) + ", 10)")
        .call(yAxis)
      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Count");

      // Bars
      // svg
      //   .selectAll('.bar')
      //   .data(lineChart)
      //   .enter()
      //   .append('rect')
      //   .attr("class", "bar")
      //   .attr('x', function (d) {
      //     return x(d.date) - margin.padd
      //   })
      //   .attr('width', 2.5)
      //   .attr('y', function (d) {
      //     return y(d.count)
      //   })
      //   .attr('height', function (d) {
      //     return height - y(d.count)
      //   })
      //   .attr('fill', '#69b3a2')
      
      
      // Draw the line
      const line = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.count); })
        // .curve(d3.curveNatural)
        

      svg
        .selectAll('path')
        .remove()
        .data(lineChart['chartarr'])
        .join('path')
        .attr('class', 'stock-lines')
        .attr('d', line)
        .style('stroke', function (d, i) {
          return bgColorList[i]
        })
        .style('stroke-width', 2)
        .style('fill', 'transparent');

      // Add the line
      // svg.append("path")
      //   .datum(lineChart)
      //   .attr("fill", "none")
      //   .attr("stroke", "#69b3a2")
      //   .attr("stroke-width", 1.5)
      //   .attr("d", d3.line()
      //     .x(function(d) { return x(d.date) })
      //     .y(function(d) { return y(d.count) })
      //   )
      
    }
  }

  return (
    <Row className='mt-4'>
      <Col md={12} xs={12}>
        <Card>
          <Card.Header className='py-4 card-header-bg-gray'>
            <h4 className='mb-0'>Topics Evolution</h4>
          </Card.Header>
          <Card.Body>
            <Col md={12} xs={12} className='m-4'>
              <svg width={width} height={height} ref={ref} />
            </Col>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default ProjectHighlight
