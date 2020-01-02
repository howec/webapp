import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';

import { Button, Form, Col, FormGroup, Checkbox } from 'react-bootstrap'

import socket from '../../../components/SocketUser';
import { Column, Row } from 'simple-flexbox';


class CreateStep3 extends Component {

  constructor(props){
    super(props);
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
        this.setState({staffOK: true})
      } 
      if(data.shared === false){
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
      console.log(data.msg);
      if(this.props.step === "Step1" && this.state.workspaceOK === true && this.state.staffOK === true){
        this.props.toNextStep();
      }
    });
  }  



  //need to make the sheetsharing stuff an actual error message
  formSubmit = (event) => {
    event.preventDefault();
    this.createWorkspaceHandler();
    
  }


  render() {
    if(this.props.step == "Step3"){
      return(

         <div className="center-me">

            <Column horizontal='center' flexGrow={1}>

            <Row>
              <h2> Create a Workspace </h2>
            </Row>

            <Row horizontal='center'>
              <Form onSubmit = {this.formSubmit}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control required type="text" placeholder="Enter your email here" />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control required type="password" placeholder="Password" />
                  <Form.Text className="text-muted">
                    A strong password between 8-16 characters long.
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId="formPassword2">
                  <Form.Label>Confirm password</Form.Label>
                  <Form.Control required type="password" placeholder="Password" />
                  <Form.Text className="text-muted">
                    Your passwords must match!
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


export default CreateStep3;










