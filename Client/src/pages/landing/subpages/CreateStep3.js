import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';

import { Button, Form, Col, FormGroup, Checkbox } from 'react-bootstrap'

import socket from '../../../components/SocketUser';
import { Column, Row } from 'simple-flexbox';


class CreateStep3 extends Component {

  constructor(props){
    super(props);
  }

  _isMounted=false;
  
  componentDidMount(){
   this._isMounted=true;
  }

  componentWillUnmount(){
    this._isMounted=false;
  }

  changeState(data){
    if(this._isMounted){
      this.setState(data)
    }
  }

  //HOWE: Note that the next steps for user quality of experience would be
  //to display the error messages from the socket emissions. That is currently
  //not my priority, though it should be very easy to implement.
  createWorkspaceHandler = () => {
    console.log("Clicked button in CreateStep3");
    let email = document.getElementById('formEmail').value;
    let password = document.getElementById('formPassword').value;
    let password2 = document.getElementById('formPassword2').value;

    //client-sided checks... will also check in the backend
    //check if valid email
    if(true){
      if(password===password2){
        //check if passwords contain no special characters
        if(true){
          socket.emit("createStep3_p1", {email: email, password: password, password2: password2});

        }else{
          console.log("Password contains invalid characters.")
        }
      } else{
        console.log("Your passwords didn't match!");
      }
    }else{
      console.log("Invalid email address.")
    }

    socket.on("confirmation", (data)=>{
      console.log(data.msg);
      if(this.props.step === "Step3"){
        this.props.toNextStep();
      }
    });

  }


  //need to make the sheetsharing stuff an actual error message
  formSubmit = (event) => {
    event.preventDefault();
    this.createWorkspaceHandler();
    
  }


  render() {
    if(this.props.step === "Step3"){
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
                    An alphanumeric password between 8-16 characters long.
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










