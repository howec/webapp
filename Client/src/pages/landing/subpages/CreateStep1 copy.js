import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';

import { Button, Form, Col, FormGroup, Checkbox } from 'react-bootstrap'

import socket from '../../../components/SocketUser';
import { Column, Row } from 'simple-flexbox';


class CreateStep1 extends Component {

  constructor(props){
    super(props);
    this.state = {sheetShared: null};
  }


  responseGoogle = (response) => {
    console.log("FAILED TO SIGN IN. " + JSON.stringify(response));
  }


  createWorkspaceHandler = () => {
    let workspace = document.getElementById('formWorkspace').value;
    let url = document.getElementById('formURL').value;


    socket.emit("createWorkspace", {sharing: this.state.sheetShared, name: workspace, url: url});
    console.log("Clicked workspace button");

    socket.on("sendingattempt", function(data){
    console.log("sending from within app.js");
    console.log(data.attempt);
    });

    socket.on("workspaceStatus", function(data){
      console.log("SKJSLKDJSKDJLKSJFKL: " + data.msg);
    })


    socket.on("sheetShared", (data)=>{
      console.log("entered sheetShared");

      //need to check if the url hasn't been used before
      if(data.shared == true){
        this.setState({sheetShared: true})
        this.props.toNextStep();

      } else{
        //generate error message here?
        this.setState({sheetShared: false})
      }
    });


  }


  formSubmit = (event) => {
    event.preventDefault();
    this.createWorkspaceHandler();
    
    if(this.state.sheetShared == true){
      console.log("The sheet has been shared!");
      this.props.toNextStep();
    } else{
      console.log("The sheet hasn't been shared");
    }
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
                  <Form.Control required type="text" placeholder="Enter your workspace name" />
                  <Form.Text className="text-muted">
                    Pick something short and sweet!
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId="formURL">
                  <Form.Label>Empty Google Sheet URL</Form.Label>
                  <Form.Control required type="text" placeholder="Enter URL" />
                  <Form.Text className="text-muted">
                    Enter an empty Google Sheet's URL to use as your persistence
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










