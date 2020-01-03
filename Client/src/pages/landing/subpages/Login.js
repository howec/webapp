import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import GoogleLogin from 'react-google-login';

// import { Button, Form, Col, FormGroup, Checkbox } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import { Button} from 'react-bootstrap';

import socket from '../../../components/SocketUser';
import { Column, Row } from 'simple-flexbox';


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

    let email = document.getElementById('formEmail').value;
    let password = document.getElementById('formPassword').value;
    socket.emit("loginSubmitted", {workspace: this.state.workspace, group: this.state.group, email: email, password: password});
  
    socket.on('loginValidation', (arg) => {
      if(arg.valid == true){
        this.props.setGroupApp(this.state.group);
        this.props.setData(arg.data);
      } else{
        this.setState({valid: false});
      }
    });
  }

  sendWorkspace = (event) =>{
    event.preventDefault();
    
    let workspace = document.getElementById('formWorkspace').value;
    socket.emit("workspaceSubmitted", {workspace: workspace});
  
    //assuming that the validation function actually works...
    socket.on('workspaceValidation', (arg) => {
      if(arg.valid == true){
        this.setState({workspace: workspace, valid: true, step: "LoginAs"});
      } else{
        this.setState({valid: false});
      }
    });
  }

  workspaceError = () => {
    if(this.state.valid != false){
      return null;
    }
    return (<p><i><font color="#CD5C5C">That workspace doesn't exist!</font></i></p>);
  }

  loginError = () => {
    if(this.state.valid != false){
      return null;
    }
    return (<p><i><font color="#CD5C5C">Incorrect login credentials!</font></i></p>);
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
                  <Form.Group controlId="formWorkspace">
                    <Form.Label>Workspace name</Form.Label>
                    <Form.Control required type="text" placeholder="Enter workspace name" />
                  </Form.Group>
                  
                  {this.workspaceError()}

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
                  
                  {this.loginError()}

                  <Row horizontal='center'>
                    <Button variant="primary" type="submit">Login!</Button>
                  </Row>

                  <Row horizontal = 'center'>
                    <p><b><font color = "#626666">-OR-</font></b></p>
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

                  <Row horizontal = 'center'>
                    <p><b><i><font size ={2} color = "#a9a9a9">Recommended if logging in as student</font></i></b></p>
                  </Row>


                </Form>
              </Row>

            </Column>
          </div>
        );
      }
    }

}


export default Login;











