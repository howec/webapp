import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';

import { Button, Form, Col, FormGroup, Checkbox } from 'react-bootstrap'

import socket from '../../../components/SocketUser';
import { Column, Row } from 'simple-flexbox';


class CreateStep2 extends Component {

  constructor(props){
    super(props);
  }

  formSubmit = (event) => {
    event.preventDefault();

    //socket emission checks

    this.props.toNextStep();

  }


  render() {
    if(this.props.step == "Step2"){
      return(

         <div className="center-me">

            <Column horizontal='center' flexGrow={1}>

            <Row>
              <h2> Create a Workspace </h2>
            </Row>

            <Row horizontal='center'>
              <Form onClick = {this.formSubmit}>
                <Form.Group controlId="formPartnersSheet">
                  <Form.Label>Partner Google Sheet URL</Form.Label>
                  <Form.Control type="text" placeholder="Enter URL" />
                  <Form.Text className="text-muted">
                    Enter the URL for your PARTNER Google Sheet
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId="formStudentsSheet">
                  <Form.Label>Student Google Sheet URL</Form.Label>
                  <Form.Control type="text" placeholder="Enter URL" />
                  <Form.Text className="text-muted">
                    Enter the URL for your STUDENT Google Sheet
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


export default CreateStep2;










