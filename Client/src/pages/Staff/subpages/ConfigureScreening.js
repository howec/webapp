import React, { Component } from 'react'

import socket from '../../../components/SocketUser';
import Table from '../../../components/Table'
import { Button, Form, Col, FormGroup, Checkbox } from 'react-bootstrap'


class ConfigureScreening extends Component {

  constructor(props){
    super(props);

  }

  _isMounted=false;
  
  componentDidMount(){
   this._isMounted=true;
   this.addEvents();
  }

  componentWillUnmount(){
    this._isMounted=false;
  }

  changeState(data){
    if(this._isMounted){
      this.setState(data)
    }
  }

  addEvents = () =>{
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";
        } else {
          content.style.display = "block";
        }
      });
    }
  }


  render() {
  	if(this.props.page === 'ConfigureScreening'){
	    return (
	    	<div>
          <h1> inside configure screening </h1>


          <div className="panel-group" id="accordion">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title">
                  <a data-toggle="collapse" data-parent="#accordion" href="#collapse1">
                    Timeline Configurations
                  </a>
                </h4>
              </div>
              <div id="collapse1" className="panel-collapse collapse in">
                <div className="panel-body">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                  minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                  commodo consequat.

                  <Form onSubmit = {this.formSubmit}>
                    <Form.Group controlId="OrgName">
                      <Form.Label>Organization Name</Form.Label>
                      <Form.Control required type="text" placeholder="Enter name here" defaultValue = {"this.props.url[0]"} maxLength = {30} style = {{width: "500px"}} />
                      <Form.Text className="text-muted">
                        Enter the name of your organization
                      </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="OrgURL">
                      <Form.Label>Organization URL</Form.Label>
                      <Form.Control required type="text" placeholder="Enter URL here" defaultValue = {"this.props.url[1]"} maxLength = {100} style = {{width: "500px"}} />
                      <Form.Text className="text-muted">
                        Enter your organization's website
                      </Form.Text>
                    </Form.Group>

                    <Button variant="primary" type="submit"> Save </Button>

                  </Form>


                </div>
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title">
                  <a data-toggle="collapse" data-parent="#accordion" href="#collapse2">
                    Student Sheet Configurations
                  </a>
                </h4>
              </div>
              <div id="collapse2" className="panel-collapse collapse">
                <div className="panel-body">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                  minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                  commodo consequat.

                  <Form onSubmit = {this.formSubmit}>
                    <Form.Group controlId="OrgName">
                      <Form.Label>Organization Name</Form.Label>
                      <Form.Control required type="text" placeholder="Enter name here" defaultValue = {"this.props.url[0]"} maxLength = {30} style = {{width: "500px"}} />
                      <Form.Text className="text-muted">
                        Enter the name of your organization
                      </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="OrgURL">
                      <Form.Label>Organization URL</Form.Label>
                      <Form.Control required type="text" placeholder="Enter URL here" defaultValue = {"this.props.url[1]"} maxLength = {100} style = {{width: "500px"}} />
                      <Form.Text className="text-muted">
                        Enter your organization's website
                      </Form.Text>
                    </Form.Group>

                    <Button variant="primary" type="submit"> Save </Button>

                  </Form>



                </div>
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title">
                  <a data-toggle="collapse" data-parent="#accordion" href="#collapse3">
                    Partner Sheet Configurations
                  </a>
                </h4>
              </div>
              <div id="collapse3" className="panel-collapse collapse">
                <div className="panel-body">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                  minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                  commodo consequat.

                <Form onSubmit = {this.formSubmit}>
                  <Form.Group controlId="OrgName">
                    <Form.Label>Organization Name</Form.Label>
                    <Form.Control required type="text" placeholder="Enter name here" defaultValue = {"this.props.url[0]"} maxLength = {30} style = {{width: "500px"}} />
                    <Form.Text className="text-muted">
                      Enter the name of your organization
                    </Form.Text>
                  </Form.Group>

                  <Form.Group controlId="OrgURL">
                    <Form.Label>Organization URL</Form.Label>
                    <Form.Control required type="text" placeholder="Enter URL here" defaultValue = {"this.props.url[1]"} maxLength = {100} style = {{width: "500px"}} />
                    <Form.Text className="text-muted">
                      Enter your organization's website
                    </Form.Text>
                  </Form.Group>

                  <Button variant="primary" type="submit"> Save </Button>

                </Form>


                </div>
              </div>
            </div>
          </div>


		    </div>
	    )
		} else{
    	return null;
    }
  }

}


export default ConfigureScreening;











