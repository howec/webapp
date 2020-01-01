import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';

import { Button, Form, Col, FormGroup, Checkbox } from 'react-bootstrap'

import socket from '../../../components/SocketUser';
import { Column, Row } from 'simple-flexbox';


class CreateStep3 extends Component {

  constructor(props){
    super(props);
  }


  formSubmit = (event) => {
    event.preventDefault();

    //socket emission checks
    this.props.toNextStep();

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










