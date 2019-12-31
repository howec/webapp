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
    this.state = {valid: null}
  }

  responseGoogleFail = (response) => {
    console.log("FAILED TO SIGN IN. " + JSON.stringify(response));
  }

  responseGoogleSucceed = (response) => {
    console.log("Succeeded signing in! " + JSON.stringify(response));
    console.log(response);

    this.props.onSignIn(response);
  }



  sendToServer = (event) =>{
    event.preventDefault();

    let email = document.getElementById('formBasicEmail').value;
    let password = document.getElementById('formBasicPassword').value;
    socket.emit("FormSubmitted", {email: email, password: password});
  }

  sendWorkspace = (event) =>{
    event.preventDefault();

    let workspace = document.getElementById('formBasicWorkspaceName').value;
    socket.emit("workspaceSubmitted", {workspace: workspace});
    console.log("IN THE sendWorkspace function!");
  
    //assuming that the validation function actually works...
    socket.on('workspaceValidation', (data) => {
      if(data.valid == true){
        this.setState({valid: true});
        this.props.toLoginAs();
      } else{
        this.setState({valid: false});
      }
    })
  }

  errorMessage = () => {
    console.log("IN ERROR MESSAGE : " + this.state.valid);

    if(this.state.valid != false){
      return null;
    }
    return (<p><i><font color="#CD5C5C">That workspace doesn't exist!</font></i></p>);
  }

  render() {
    if(this.props.page == "Login"){

      if(this.props.step==null){
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
                </Form>
              </Row>

            </Column>

          </div>
        )
      } else{
        return null;
      }
    } else{
      return null;
    }
  }

}


export default Login;











