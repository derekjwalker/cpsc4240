import React from "react";
import { Container, Row, Col } from 'react-bootstrap';
import data from "./DerekData.json";
import * as d3 from "d3";

export function Derek() {
  let packetTypes = [];
  let types = [];
  let typeCount = [];

  function addNewType(x){
    types.push(x);
    typeCount.push(1);
  }

  data.forEach((i) => packetTypes.push(Object.values(i._source.layers.frame).at(16)))
  packetTypes.forEach(x => types.includes(x) ? typeCount[types.indexOf(x)] += 1 : addNewType(x))

  let udpPackets = [];
  let tcpPackets = [];
  let otherPackets = [];
  
  data.forEach((i) => Object.values(i._source.layers.frame).at(16) === 'UDP' ? udpPackets.push(i) : Object.values(i._source.layers.frame).at(16) === 'TCP SYN/FIN' ? tcpPackets.push(i) : otherPackets.push(i))

  const titles = ["UDP","TCP SYN/FIN", "Other"];
  const count = [{title:"UDP", count:udpPackets.length},{title:"TCP SYN/FIN", count:tcpPackets.length},{title:"Other", count:otherPackets.length}]

  let udpObjects = [];
  let udpExposed = [];
  let udpPotentialQueryObjects = [];
  let udpQueryObjects = [];
  let udpQueryExposed = [];

  udpPackets.forEach(
    function(d){
      udpObjects.push(Object.values(d._source.layers.eth).at(1))
      udpObjects.push(Object.values(d._source.layers.eth).at(3))
    }
  )
  udpObjects.forEach(
    function(d){
      if(!udpExposed.includes(Object.values(d).at(2))){
        udpExposed.push(Object.values(d).at(2)) 
      }
      if(!udpExposed.includes(Object.values(d).at(6))){
        udpExposed.push(Object.values(d).at(6))
      }
    }
  )
  udpPackets.forEach((d) => udpPotentialQueryObjects.push(Object.values(d._source.layers).at(4)))
  udpPotentialQueryObjects.forEach(
    function(d){
      if(Object.values(d).length > 8 && typeof Object.values(d).at(7) === 'object'){
        udpQueryObjects.push(Object.values(d).at(7))
      }
    }
  )
  udpQueryObjects.forEach((d) => udpQueryExposed.push(Object.values(d).at(0)))
  udpQueryExposed.forEach(
    function(d){
      if(!udpExposed.includes(Object.values(d).at(0))){
        udpExposed.push(Object.values(d).at(0))
      }
    }
  )
  console.log(udpExposed)

  let tcpObjects = [];
  let tcpExposed = [];

  tcpPackets.forEach(
    function(d){
      tcpObjects.push(Object.values(d._source.layers.eth).at(1))
      tcpObjects.push(Object.values(d._source.layers.eth).at(3))
    }
  )
  tcpObjects.forEach(
    function(d){
      if(!tcpExposed.includes(Object.values(d).at(2))){
        tcpExposed.push(Object.values(d).at(2))
      }
      if(!tcpExposed.includes(Object.values(d).at(6))){
        tcpExposed.push(Object.values(d).at(6))
      }
    }
  )
  console.log(tcpExposed)
  
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
       .data(pie(typeCount))
       .join("path")
       .attr("d", arc)
       .attr("fill", (d) => color(d))
       .attr("stroke","black")
       .style("stroke-width", ".25px");
  })

  React.useEffect(() =>{
    var svg = d3.select("#potentialRisk")
    .attr("width", 400)
    .attr("height", 400)
    .append("g")
    .attr("transform",
          "translate(" + 60 + "," + 30 + ")")

    var xaxis = d3.scaleBand()
                  .range([0,300])
                  .domain(titles.map(function(title){ return title}))
                  .padding(0.2)
    svg.append("g").attr("transform", "translate(0," + 300 + ")").call(d3.axisBottom(xaxis))

    var yaxis = d3.scaleLinear()
                  .domain([0,1000])
                  .range([300,0])
    svg.append("g").call(d3.axisLeft(yaxis))

    svg.selectAll("mybar")
      .data(count)
      .enter()
      .append("rect")
        .attr("x", function(d) { return xaxis(d.title); })
        .attr("y", function(d) { return yaxis(d.count); })
        .attr("width", xaxis.bandwidth())
        .attr("height", function(d) { return 300 - yaxis(d.count); })


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