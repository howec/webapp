import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import GoogleLogin from 'react-google-login';

// import { Button, Form, Col, FormGroup, Checkbox } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import { Button} from 'react-bootstrap';

import socket from '../../../components/SocketUser';
import { Column, Row } from 'simple-flexbox';


class LoginAs extends Component {

  constructor(props){
    super(props);
  
  }

  render() {
    if(this.props.step == "LoginAs"){
        return (
          <div className='center-me'>

            <Column flexGrow={1}>
              <Row horizontal='center'>
                <h1> Which are you logging in as? </h1>
              </Row>

              <Row horizontal='center'>
                <Button onClick={this.props.toLoginAsStaff}>Staff</Button>
              </Row>

              <Row horizontal='center'>
                <Button onClick={this.props.toLoginAsPartner}>Partner</Button>
              </Row>

              <Row horizontal='center'>
                <Button onClick={this.props.toLoginAsStudent}>Student</Button>
              </Row>

            </Column>

          </div>
        )

    } else{
      return null;
    }
  }

}


export default LoginAs;











