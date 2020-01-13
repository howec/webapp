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

    if(url.length > 2 && url.substring(0,2) !== "//" && url.substring(0,7)!=="http://" && url.substring(0,8)!=="https://"){
      let temp = "//" + url;
      url = temp;
    }

    socket.emit("configureBanner", {orgName: name, orgURL: url});
    this.props.changeBannerNameURL(name, url);
  }

  parseURL = () =>{
    let url = this.props.url[1];

    if(url.length > 2 && url.substring(0,2) === "//"){
      url = url.substring(2);
    }
    return url;
  }


  render() {
  	if(this.props.page === 'ConfigureBanner'){
	    return (
	    	<div>
          <h2>Banner Configurations</h2>


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
                  <Form.Control required type="text" placeholder="Enter URL here" defaultValue = {this.parseURL()} maxLength = {100} style = {{width: "500px"}} />
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











