import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import GoogleLogin from 'react-google-login';

// import { Button, Form, Col, FormGroup, Checkbox } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import { Button} from 'react-bootstrap';

import socket from '../../../components/SocketUser';
import { Column, Row } from 'simple-flexbox';


class LoginAsStaff extends Component {

  constructor(props){
    super(props);
  
  }

  render() {
    if(this.props.step == "LoginAsStaff"){
        return (
          <div className='center-me'>

            <Column horizontal='center' flexGrow={1}>


              <Row horizontal='center'>
                  <h1>staff!</h1>
              </Row>

              <Row horizontal='center'>
                <Form onSubmit = {this.sendWorkspace}>
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


export default LoginAsStaff;











