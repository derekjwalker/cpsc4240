import { Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Container, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import { Motivation } from "./Motivation.js";
import { Anil } from "./Anil.js";
import { Derek } from "./Derek.js";
import { Kevin } from "./Kevin.js";
import { Sid } from "./Sid.js";

function App() {
  return (
    <>
      <Container>
        <Row>
          <Col>
          <h1>Personal Information Exposed by IoT Devices</h1>
          </Col>
        </Row>
        <Row>
          <DropdownButton title="Select a member">
            <Dropdown.Item href="/motivation">Motivation</Dropdown.Item>
            <Dropdown.Item href="/anil">Anil</Dropdown.Item>
            <Dropdown.Item href="/derek">Derek</Dropdown.Item>
            <Dropdown.Item href="/kevin">Kevin</Dropdown.Item>
            <Dropdown.Item href="/sid">Sid</Dropdown.Item>
          </DropdownButton>
        </Row>
      </Container>

      <Routes>
        <Route path='/motivation' element={<Motivation />}/>
        <Route path='/anil' element={<Anil />}/>
        <Route path='/derek' element={<Derek />}/>
        <Route path='/kevin' element={<Kevin />}/>
        <Route path='/sid' element={<Sid />}/>
      </Routes>
    </>
  );
}

export default App;
