import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';

import { Form, Col, FormGroup, Checkbox } from 'react-bootstrap'

import socket from '../../../components/SocketUser';


class Create extends Component {

  constructor(props){
    super(props);
  }


  responseGoogle = (response) => {
    console.log("FAILED TO SIGN IN. " + JSON.stringify(response));
  }


  createWorkspaceHandler = () => {
    socket.emit("createWorkspace", {name: "NAME", url: "URL"});
    console.log("Clicked workspace button");

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


  formSubmit = () => {
    this.createWorkspaceHandler();

    this.props.toConfirmation();

  }


  render() {
    if(this.props.page == "Create"){
      return(
        <div>
          <h1> Should be in Create now </h1>
          <h2> create here </h2>


            <Form>
              <Form.Group controlId="formBasicWorkspaceName">
                <Form.Label>Workspace Name</Form.Label>
                <Form.Control type="workspaceName" placeholder="Enter your workspace name" />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Check me out" />
              </Form.Group>
              <button variant="primary" type="submit">
                Submit
              </button>
            </Form>


          <button onClick = {this.formSubmit}>Create a workspace</button>
        </div>
      )
    } else{
      return null;
    }    
  }

}


export default Create;










