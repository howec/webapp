import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';

import { Button, Form, Col, FormGroup, Checkbox } from 'react-bootstrap'

import socket from '../../../components/SocketUser';
import { Column, Row } from 'simple-flexbox';

import CreateStep1 from './CreateStep1';
import CreateStep2 from './CreateStep2';
import CreateStep3 from './CreateStep3';

class Create extends Component {

  constructor(props){
    super(props);
    this.state = {step: "Step1"};
  }


  toNextStep = () => {
    console.log("The current step is.... " + this.state.step);

    if(this.state.step == "Step1"){
      this.setState({step: "Step2"});
    }else if(this.state.step == "Step2"){
      this.setState({step: "Step3"});
    }else if (this.state.step == "Step3"){
      this.setState({step: "Step1"});
      this.props.toConfirmation();
    }
  }


  render() {
    if(this.props.page == "Create"){
      return(
        <div>
          <CreateStep1 toNextStep = {this.toNextStep} step = {this.state.step}/>
          <CreateStep2 toNextStep = {this.toNextStep} step = {this.state.step}/>
          <CreateStep3 toNextStep = {this.toNextStep} step = {this.state.step}/>
        </div>
      )
    } else{
      return null;
    }    
  }

}


export default Create;










