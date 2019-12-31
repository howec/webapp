import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import GoogleLogin from 'react-google-login';

// import { Button, Form, Col, FormGroup, Checkbox } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import { Button} from 'react-bootstrap';

import socket from '../../../components/SocketUser';
import { Column, Row } from 'simple-flexbox';

import LoginAs from './LoginAs'


class Login extends Component {

  constructor(props){
    super(props);
    this.state = {valid: null, step: null, workspace: null, group: null}
  }

  responseGoogleFail = (response) => {
    console.log("FAILED TO SIGN IN. " + JSON.stringify(response));
  }

  responseGoogleSucceed = (response) => {
    console.log("Succeeded signing in! " + JSON.stringify(response));
    console.log(response);

    this.props.onSignIn(response);
  }



  sendLogin = (event) =>{
    event.preventDefault();

    let email = document.getElementById('formBasicEmail').value;
    let password = document.getElementById('formBasicPassword').value;
    socket.emit("FormSubmitted", {workspace: this.state.workspace, group: this.state.group, email: email, password: password});
  }

  sendWorkspace = (event) =>{
    event.preventDefault();

    let workspace = document.getElementById('formBasicWorkspaceName').value;
    socket.emit("workspaceSubmitted", {workspace: workspace});
    console.log("IN THE sendWorkspace function!");
  
    //assuming that the validation function actually works...
    socket.on('workspaceValidation', (data) => {
      if(data.valid == true){
        this.setState({workspace: workspace, valid: true, step: "LoginAs"});
      } else{
        this.setState({valid: false});
      }
    });
  }

  errorMessage = () => {
    console.log("IN ERROR MESSAGE : " + this.state.valid);

    if(this.state.valid != false){
      return null;
    }
    return (<p><i><font color="#CD5C5C">That workspace doesn't exist!</font></i></p>);
  }

  setGroupStaff = () => {
    this.setState({group: "Staff", step: "Staff"});
  }

  setGroupStudents = () => {
    this.setState({group: "Students", step: "Students"});
  }

  setGroupPartners = () => {
    this.setState({group: "Partners", step: "Partners"});
  }


  render() {
      if(this.state.step==null){
        return(
            <div className="center-me">
            <Column horizontal='center' flexGrow={1}>


              <Row horizontal='center'>
                  <h2>Login to your workspace</h2>
              </Row>

              <Row horizontal='center'>
                <Form onSubmit = {this.sendWorkspace}>
                  <Form.Group controlId="formBasicWorkspaceName">
                    <Form.Label>Workspace name</Form.Label>
                    <Form.Control required type="text" placeholder="Enter workspace name" />
                  </Form.Group>
                  
                  {this.errorMessage()}

                  <Row horizontal='center'>
                    <Button variant="primary" type="submit">Go!</Button>
                  </Row>

                  <Row horizontal = 'center'>
                    <GoogleLogin
                      clientId="273539098251-5nhctai82l0ram9s38gkp7s22ahc4lui.apps.googleusercontent.com"
                      buttonText="Login with Google"
                      onSuccess={this.responseGoogleSucceed}
                      onFailure={this.responseGoogleFail}
                      cookiePolicy={'single_host_origin'}
                    />
                  </Row>

                </Form>
              </Row>

            </Column>

          </div>
        )
      } else if(this.state.step == "LoginAs") {
          return (
            <div className='center-me'>

              <Column flexGrow={1}>
                <Row horizontal='center'>
                  <h1> Which are you logging in as? </h1>
                </Row>

                <Row horizontal='center'>
                  <Button onClick={this.setGroupStaff}>Staff</Button>
                </Row>

                <Row horizontal='center'>
                  <Button onClick={this.setGroupPartners}>Partner</Button>
                </Row>

                <Row horizontal='center'>
                  <Button onClick={this.setGroupStudents}>Student</Button>
                </Row>

              </Column>

            </div>
          );
      } else{
        return (
          <div className='center-me'>

            <Column horizontal='center' flexGrow={1}>


              <Row horizontal='center'>
                  <h1>{this.state.group}</h1>
              </Row>

              <Row horizontal='center'>
                <Form onSubmit = {this.sendLogin}>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control required type="email" placeholder="Enter email" />
                  </Form.Group>

                  <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control required type="password" placeholder="Enter password" />
                  </Form.Group>
                  
                  <Row horizontal='center'>
                    <Button variant="primary" type="submit">Login!</Button>
                  </Row>

                  <GoogleLogin
                    clientId="273539098251-5nhctai82l0ram9s38gkp7s22ahc4lui.apps.googleusercontent.com"
                    buttonText="Login with Google"
                    onSuccess={this.responseGoogleSucceed}
                    onFailure={this.responseGoogleFail}
                    cookiePolicy={'single_host_origin'}
                  />


                </Form>
              </Row>

            </Column>
          </div>
        );
      }
    }

}


export default Login;











