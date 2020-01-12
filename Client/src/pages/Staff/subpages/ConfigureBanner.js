import React, { Component } from 'react'

import socket from '../../../components/SocketUser';
import Table from '../../../components/Table'
import { Button, Form, Col, FormGroup, Checkbox } from 'react-bootstrap'


class ConfigureBanner extends Component {

  constructor(props){
    super(props);
    // this.state = {name: this.props.url[0], url: this.props.url[]};

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


  //HOWE: not working! need to make sure that I am updating CELLS, because currently I've only
  //been adding rows
  //also, setting url to "data.berkeley.edu" takes me to "localhost:3000/data.berkeley.edu" for
  //whatever reason
  formSubmit = (event) =>{
    event.preventDefault();

    console.log("Form submitted");


    let name = document.getElementById("OrgName").value;
    let url = document.getElementById("OrgURL").value;

    console.log("Name is: " + name);
    console.log("url is: " + url);


    socket.emit("configureBanner", {orgName: name, orgURL: url});
    this.props.changeBannerNameURL(name, url);
  }


  render() {
  	if(this.props.page === 'ConfigureBanner'){
	    return (
	    	<div>
              <Form onSubmit = {this.formSubmit}>
                <Form.Group controlId="OrgName">
                  <Form.Label>Organization Name</Form.Label>
                  <Form.Control required type="text" placeholder="Enter name here" defaultValue = {this.props.url[0]} maxLength = {30} style = {{width: "500px"}} />
                  <Form.Text className="text-muted">
                    Enter the name of your organization
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId="OrgURL">
                  <Form.Label>Organization URL</Form.Label>
                  <Form.Control required type="text" placeholder="Enter URL here" defaultValue = {this.props.url[1]} maxLength = {100} style = {{width: "500px"}} />
                  <Form.Text className="text-muted">
                    Enter your organization's website
                  </Form.Text>
                </Form.Group>

                <Button variant="primary" type="submit"> Save </Button>

              </Form>



		    </div>
	    )
		} else{
    	return null;
    }
  }

}


export default ConfigureBanner;











