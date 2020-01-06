import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';

import { Button, Form, Col, FormGroup, Checkbox } from 'react-bootstrap'

import socket from '../../../components/SocketUser';
import { Column, Row } from 'simple-flexbox';


class CreateStep2 extends Component {

  constructor(props){
    super(props);
    this.state = {partnerOK: null, studentOK: null}
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
    console.log("Clicked button in CreateStep2");
    let urlPartner = document.getElementById('formPartnersSheet').value;
    let urlStudent = document.getElementById('formStudentsSheet').value;

    socket.emit("createStep2_p1", {urlPartner: urlPartner, urlStudent: urlStudent});

    socket.on("partnerShared", (data)=>{
      console.log("entered partnerShared");
      if(data.shared === true){
        urlPartner = data.url;
        this.changeState({partnerOK: true})
      } 
      if(data.shared === false){
        urlPartner = data.url;
        this.changeState({partnerOK: false});
      }

      console.log(this.state.partnerOK);


      this.nextPart(urlPartner, urlStudent);
    });
    
    socket.on("studentShared", (data)=>{
      console.log("entered studentShared");
      if(data.shared === true){
        urlStudent = data.url;
        this.changeState({studentOK: true})
      } 
      if(data.shared === false){
        urlStudent = data.url;
        this.changeState({studentOK: false});
      }

      console.log(this.state.studentOK);

      //doesn't matter which socket this function is called in... but I'm just doing it here
      this.nextPart(urlPartner, urlStudent);

    });
    }


  //for the error messages!
  nextPart = (urlPartner, urlStudent) =>{


      console.log(this.state.partnerOK);
      console.log(this.state.studentOK);

    socket.emit("createStep2_p2",
      {partnerSharing: this.state.partnerOK, studentSharing: this.state.studentOK,
      urlPartner: urlPartner, urlStudent: urlStudent});




    socket.on("partnerStatus", (data)=>{
      //just in case?
      if(data.ok === true){
        this.changeState({partnerOK: true});
      }

      if(data.ok === false){
        this.changeState({partnerOK: false});
      }

      console.log("SKJSLKDJSKDJLKSJFKL: " + data.msg);
      console.log(this.state.partnerOK);
    });


    socket.on("studentStatus", (data)=>{
      //just in case?
      if(data.ok === true){
        this.changeState({studentOK: true});
      }

      if(data.ok === false){
        this.changeState({studentOK: false});
      }

      console.log("SKJSLKDJSKDJLKSJFKL: " + data.msg);
      console.log(this.state.studentOK);
    });


    socket.on("duplicate", (data)=>{
      console.log(data.msg);
    });



    socket.on("approved", (data)=>{
      console.log(data.msg);
      if(this.props.step === "Step2" && this.state.partnerOK === true && this.state.studentOK === true){
        this.props.toNextStep();
      }
    });
  
  }  



  //need to make the sheetsharing stuff an actual error message
  formSubmit = (event) => {
    event.preventDefault();
    this.createWorkspaceHandler();
    
    if(this.state.partnerOK == true){
      console.log("The sheet has been shared!");
    } else{
      console.log("The sheet hasn't been shared");
    }

    if(this.state.studentOK == true){
      console.log("The sheet has been shared!");
    } else{
      console.log("The sheet hasn't been shared");
    }

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
              <Form onSubmit = {this.formSubmit}>
                <Form.Group controlId="formPartnersSheet">
                  <Form.Label>Partner Google Sheet URL</Form.Label>
                  <Form.Control required type="text" placeholder="Enter URL" />
                  <Form.Text className="text-muted">
                    Enter the URL for your PARTNER Google Sheet
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId="formStudentsSheet">
                  <Form.Label>Student Google Sheet URL</Form.Label>
                  <Form.Control required type="text" placeholder="Enter URL" />
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










