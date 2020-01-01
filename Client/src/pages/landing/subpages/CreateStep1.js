import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';

import { Button, Form, Col, FormGroup, Checkbox } from 'react-bootstrap'

import socket from '../../../components/SocketUser';
import { Column, Row } from 'simple-flexbox';


class CreateStep1 extends Component {

  constructor(props){
    super(props);
  }


  responseGoogle = (response) => {
    console.log("FAILED TO SIGN IN. " + JSON.stringify(response));
  }


  createWorkspaceHandler = () => {
    let workspace = document.getElementById('formWorkspace').value;


    socket.emit("createWorkspace", {name: workspace});    console.log("Clicked workspace button");

    console.log('before the emission');
    socket.emit('test', {testing: "0000"});

    socket.on("sendingattempt", function(data){
    console.log("sending from within app.js");
    console.log(data.attempt);
    });

    socket.on("workspaceStatus", function(data){
      console.log("SKJSLKDJSKDJLKSJFKL: " + data.msg);
    })

  }


  formSubmit = (event) => {
    event.preventDefault();
    this.createWorkspaceHandler();

    this.props.toNextStep();

  }


  render() {
    if(this.props.step == "Step1"){
      return(

         <div className="center-me">

            <Column horizontal='center' flexGrow={1}>

            <Row>
              <h2> Create a Workspace </h2>
            </Row>

            <Row horizontal='center'>
              <Form onSubmit = {this.formSubmit}>
                <Form.Group controlId="formWorkspace">
                  <Form.Label>Workspace name</Form.Label>
                  <Form.Control required type="text" placeholder="Enter here" />
                  <Form.Text className="text-muted">
                    Pick something short and sweet!
                  </Form.Text>
                </Form.Group>
                
                <Row horizontal="center">
                  <Button variant="primary" type="submit"> Submit</Button>
                </Row>
              
              </Form>
            </Row>
            
            </Column>

         </div>
      )
    } else{
      return null;
    }    
  }

}


export default CreateStep1;










