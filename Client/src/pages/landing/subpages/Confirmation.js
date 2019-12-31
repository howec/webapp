import React, { Component } from 'react';
import { Button, Form, Col, FormGroup, Checkbox } from 'react-bootstrap'

import socket from '../../../components/SocketUser';
import { Column, Row } from 'simple-flexbox';


class Confirmation extends Component {

  constructor(props){
    super(props);
  }


  responseGoogle = (response) => {
    console.log("FAILED TO SIGN IN. " + JSON.stringify(response));
  }


  returnSubmit = () => {
    this.props.toLanding();
  }


  render() {
    if(this.props.page == "Confirmation"){
      return(
        <div className="center-me">
          <Column horizontal = 'center'>
            <Row horizontal = 'center'>
              <h1> Success! </h1>
            </Row>
            <Row horizontal = "center">            
              <p> You're all set up! Login as "Staff" to finish configuring your settings.</p>
            </Row>
            <Row horizontal = 'center'>
              <Button onClick = {this.returnSubmit}>Return to Applica</Button>
            </Row>
          </Column>
        </div>
      );
    } else{
      return null;
    }
  }

}


export default Confirmation;









