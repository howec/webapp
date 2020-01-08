import React, { Component } from 'react'

import socket from '../../../components/SocketUser';
import Table from '../../../components/Table'
import { Button, Form, Col, FormGroup, Checkbox } from 'react-bootstrap'


class ConfigureBanner extends Component {

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

  formSubmit = () =>{
    socket.emit();
  }


  render() {
  	if(this.props.page === 'ConfigureBanner'){
	    return (
	    	<div>
              <Form onSubmit = {this.formSubmit}>
                <Form.Group controlId="formPartnersSheet">
                  <Form.Label>Organization Name</Form.Label>
                  <Form.Control required type="text" placeholder="Enter name here" defaultValue = "Some Org" maxLength = {30} style = {{width: "500px"}} />
                  <Form.Text className="text-muted">
                    Enter the name of your organization
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId="formStudentsSheet">
                  <Form.Label>Organization URL</Form.Label>
                  <Form.Control required type="text" placeholder="Enter URL here" maxLength = {100} style = {{width: "500px"}} />
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











