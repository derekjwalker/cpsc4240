import React from "react";
import { Container, Row, Col } from 'react-bootstrap';
import data from "./DerekData.json";
import * as d3 from "d3";

export function Derek() {
  //Really rough way of extracting packet type
  const idea = [];
  data.forEach((i) => idea.push(Object.values(i._source.layers.frame).at(16)))
  const idea2 = [];
  const idea3 = [];
  function update(x){
    idea2.push(x);
    idea3.push(1);
  }
  idea.forEach(x => idea2.includes(x) ? idea3[idea2.indexOf(x)] += 1 : update(x))
  console.log(idea2)
  console.log(idea3)

  //Filters UDP packets
  const useful = [];
  const not = []
  data.forEach((i) => Object.values(i._source.layers.frame).at(16) === 'UDP' ? useful.push(i) : not.push(i))
  console.log(useful)
  
  React.useEffect(() => {
    var svg = d3.select("#packetTypes")
    .attr("width", 210)
    .attr("height", 210)
    var arc = d3.arc().innerRadius(0).outerRadius(100)
    var pie = d3.pie().value(function(d) {return d})
    const color = d3.scaleOrdinal().range(["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"])
    svg.append("g")
       .attr("transform", "translate(" + 105 + "," + 105 + ")")
       .selectAll()
       .data(pie(idea3))
       .join("path")
       .attr("d", arc)
       .attr("fill", (d) => color(d))
       .attr("stroke","black")
       .style("stroke-width", ".25px");
  })
  

  return(
    <Container>
      <Row>
        <h3>Derek's Data</h3>
      </Row>
      <Row>
        <p>This data was collected on a residential home network used by 5 people and their devices.</p>
      </Row>
      <Row>
        <Col><svg id="packetTypes"></svg></Col>
        <Col><svg id="potentialRisk"></svg></Col>
        <Col></Col>
      </Row>
    </Container>

  );
}