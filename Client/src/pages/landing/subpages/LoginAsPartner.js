import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import GoogleLogin from 'react-google-login';

// import { Button, Form, Col, FormGroup, Checkbox } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import { Button} from 'react-bootstrap';

import socket from '../../../components/SocketUser';
import { Column, Row } from 'simple-flexbox';


class LoginAsPartner extends Component {

  constructor(props){
    super(props);
  
  }

  render() {
    if(this.props.step == "LoginAsPartner"){
        return (
          <div className='center-me'>

            <h1>Should be in partner</h1>

          </div>
        )

    } else{
      return null;
    }
  }

}


export default LoginAsPartner;











