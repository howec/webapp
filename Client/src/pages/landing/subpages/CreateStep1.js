import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';

import { Button, Form, Col, FormGroup, Checkbox } from 'react-bootstrap'

import socket from '../../../components/SocketUser';
import { Column, Row } from 'simple-flexbox';


class CreateStep1 extends Component {

  constructor(props){
    super(props);
    this.state = {workspaceOK: null, staffOK: null};
  }


  //HOWE: Note that the next steps for user quality of experience would be
  //to display the error messages from the socket emissions. That is currently
  //not my priority, though it should be very easy to implement.
  createWorkspaceHandler = () => {
    console.log("Clicked button in CreateStep1");
    let url = document.getElementById('formURL').value;

    socket.emit("createStep1_p1", {url: url});

    socket.on("sheetShared", (data)=>{
      console.log("entered sheetShared");

      if(data.shared === true){
        url = data.url;
        this.setState({staffOK: true})
      } 
      if(data.shared === false){
        url = data.url;
        this.setState({staffOK: false});
      }
    
      this.nextPart(url);

    });
  }

  //for the error messages!
  nextPart = (url) =>{
    let workspace = document.getElementById('formWorkspace').value;

    socket.emit("createStep1_p2", {sharing: this.state.staffOK, name: workspace, url: url});


    socket.on("workspaceStatus", (data)=>{
      if(data.ok === true){
        this.setState({workspaceOK: true});
      }

      if(data.ok === false){
        this.setState({workspaceOK: false});
      }
      console.log("SKJSLKDJSKDJLKSJFKL: " + data.msg);
      console.log(this.state.workspaceOK)
    });

    socket.on("urlStatus", (data)=>{
      //just in case?
      if(data.ok === true){
        this.setState({staffOK: true});
      }

      if(data.ok === false){
        this.setState({staffOK: false});
      }

      console.log("SKJSLKDJSKDJLKSJFKL: " + data.msg);
      console.log(this.state.staffOK);
    });


    socket.on("approved", (data)=>{
      console.log("INSIDE APPROVED");
      console.log(data.msg);
      console.log("workspace: " + this.state.workspaceOK);
      console.log("staffOK: " + this.state.staffOK);
      if(this.props.step === "Step1" && this.state.workspaceOK === true && this.state.staffOK === true){
        this.props.toNextStep();
      }
    });
  }  



  //need to make the sheetsharing stuff an actual error message
  formSubmit = (event) => {
    event.preventDefault();
    this.createWorkspaceHandler();
    
    if(this.state.staffOK === true){
      console.log("The sheet has been shared!");
    } else{
      console.log("The sheet hasn't been shared");
    }
  }


  render() {
    if(this.props.step === "Step1"){
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










