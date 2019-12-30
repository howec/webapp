import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import GoogleLogin from 'react-google-login';

// import { Button, Form, Col, FormGroup, Checkbox } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import { Button} from 'react-bootstrap';

import socket from '../../../components/SocketUser';


class Login extends Component {

  constructor(props){
    super(props);
  }

  responseGoogleFail = (response) => {
    console.log("FAILED TO SIGN IN. " + JSON.stringify(response));
  }

  responseGoogleSucceed = (response) => {
    console.log("Succeeded signing in! " + JSON.stringify(response));
    console.log(response);

    this.props.onSignIn(response);
  }



  sendToServer = () =>{
    let workspace = document.getElementById('formBasicWorkspaceName').value;
    let email = document.getElementById('formBasicEmail').value;
    let password = document.getElementById('formBasicPassword').value;
    socket.emit("FormSubmitted", {workspace: workspace, email: email, password: password});
  }



  render() {
    // if on the "Login" page
    if(this.props.page == "Login"){
      return(
        <div>
          <div>
            <h1> LOGIN PAGE... </h1>

            <Form onSubmit = {this.sendToServer}>
              <Form.Group controlId="formBasicWorkspaceName">
                <Form.Label>Workspace name</Form.Label>
                <Form.Control required type="text" placeholder="Enter your workspace name" />
              </Form.Group>

              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control required type="email" placeholder="Enter email" />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control required type="password" placeholder="Password" />
              </Form.Group>

              <Button variant="primary" type="submit">
                Login here! 
              </Button>
            </Form>






            <GoogleLogin
              clientId="273539098251-5nhctai82l0ram9s38gkp7s22ahc4lui.apps.googleusercontent.com"
              buttonText="Login"
              onSuccess={this.responseGoogleSucceed}
              onFailure={this.responseGoogleFail}
              cookiePolicy={'single_host_origin'}
            />


          </div>
        </div>
      )
    } else{
      return null;
    }
  }

}


export default Login;











