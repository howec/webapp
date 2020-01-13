import React, { Component } from 'react'

import socket from '../../../components/SocketUser';
import Table from '../../../components/Table'
import { Button, Form, Col, FormGroup, Checkbox } from 'react-bootstrap'

import { Column, Row } from 'simple-flexbox';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



class ConfigureSheets extends Component {

  constructor(props){
    super(props);
    this.state = {stage1: new Date(),
                  stage2: new Date(),
                  stage3: new Date(),
                  stage4: new Date()};

  }

  _isMounted=false;
  
  componentDidMount(){
   this._isMounted=true;

   socket.emit("configureSheets", {});
  }

  componentWillUnmount(){
    this._isMounted=false;
  }

  changeState(data){
    if(this._isMounted){
      this.setState(data)
    }
  }


  //Use this function to submit the changes to state to backend
  submitTimeline = (event) =>{
    event.preventDefault();
  }

  submitStudentSheet = (event) => {
    event.preventDefault();
  }

  submitPartnerSheet = (event) => {
    event.preventDefault();
  }


  handleChange1 = (date) => {
    this.changeState({
      stage1: date
    });
  };

  handleChange2 = (date) => {
    this.changeState({
      stage2: date
    });
  };

  handleChange3 = (date) => {
    this.changeState({
      stage3: date
    });
  };

  handleChange4 = (date) => {
    this.changeState({
      stage4: date
    });
  };

  render() {
  	if(this.props.page === 'ConfigureSheets'){
	    return (
	    	<div>
          <h2>Sheet Configurations</h2>


          <div className="panel-group" id="accordion">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title">
                  <a data-toggle="collapse" data-parent="#accordion" href="#collapse1"
                    style={{marginTop: "8px", marginBottom: "3px"}}>
                    Set Timeline
                  </a>
                </h4>
              </div>
              <div id="collapse1" className="panel-collapse collapse in">
                <div className="panel-body">
                  <Row>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat.
                  </Row>
                

                  <Row>
                    <Form onSubmit = {this.submitTimeline}>
                      <Row>
                        <p style={{marginTop: "10px", marginBottom: "3px"}}><b>Stage 1 Deadline</b></p>
                      </Row>
                      <Row>
                        <DatePicker
                          id ="CustomDatePicker"
                          selected={this.state.stage1}
                          onChange={this.handleChange1}/>
                      </Row>

                      <Row>
                        <p style={{marginTop: "10px", marginBottom: "3px"}}><b>Stage 2 Deadline</b></p>
                      </Row>
                      <Row>
                        <DatePicker
                          id ="CustomDatePicker"
                          selected={this.state.stage2}
                          onChange={this.handleChange2}/>
                      </Row>

                      <Row>
                        <p style={{marginTop: "10px", marginBottom: "3px"}}><b>Stage 3 Deadline</b></p>
                      </Row>
                      <Row>
                        <DatePicker
                          id ="CustomDatePicker"
                          selected={this.state.stage3}
                          onChange={this.handleChange3}/>
                      </Row>

                      <Row>
                        <p style={{marginTop: "8px", marginBottom: "5px"}}><b>Stage 4 Deadline</b></p>
                      </Row>
                      <Row>
                        <DatePicker
                          id ="CustomDatePicker"
                          selected={this.state.stage4}
                          onChange={this.handleChange4}/>
                      </Row>
                      

                      
                      <Row>
                        <Button variant="primary" type="submit"> Save </Button>
                      </Row>
                    </Form>
                  </Row>


                </div>
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title">
                  <a data-toggle="collapse" data-parent="#accordion" href="#collapse2"
                    style={{marginTop: "8px", marginBottom: "3px"}}>
                    Set Student Sheet
                  </a>
                </h4>
              </div>
              <div id="collapse2" className="panel-collapse collapse">
                <div className="panel-body">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                  minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                  commodo consequat.

                  <Form onSubmit = {this.submitStudentSheet}>
                    <Form.Group controlId="StudentSheetIndex">
                      <Form.Label>Student Sheet Index</Form.Label>
                      <Form.Control required type="text" placeholder="Select the appropriate column to serve as the index" defaultValue = {"default"} maxLength = {30} style = {{width: "500px"}} />
                      <Form.Text className="text-muted">
                        This will need to be a dropdown
                      </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="SelectedColumnsFromStudentSpreadsheet">
                      <Form.Label>Selected Columns from Student Spreadsheet</Form.Label>
                      <Form.Control required type="text" placeholder="Select which columns to serve to partners" defaultValue = {"default"} maxLength = {100} style = {{width: "500px"}} />
                      <Form.Text className="text-muted">
                        This will be a checkbox table
                      </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="ColumnMappingsToPartner">
                      <Form.Label>Column Mappings to Partner</Form.Label>
                      <Form.Control required type="text" placeholder="Select the columns that contain the groups applied to" defaultValue = {"default"} maxLength = {100} style = {{width: "500px"}} />
                      <Form.Text className="text-muted">
                        This will be a checkbox table
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
                  <a data-toggle="collapse" data-parent="#accordion" href="#collapse3"
                    style={{marginTop: "8px", marginBottom: "3px"}}>
                    Set Partner Sheet
                  </a>
                </h4>
              </div>
              <div id="collapse3" className="panel-collapse collapse">
                <div className="panel-body">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                  minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                  commodo consequat.

                  <Form onSubmit = {this.submitPartnerSheet}>
                    <Form.Group controlId="PartnerSheetIndex">
                      <Form.Label>Partner Sheet Index</Form.Label>
                      <Form.Control required type="text" placeholder="Select the appropriate column to serve as the index" defaultValue = {"default"} maxLength = {30} style = {{width: "500px"}} />
                      <Form.Text className="text-muted">
                        This will need to be a dropdown
                      </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="SelectedColumnsFromPartnerSpreadsheet">
                      <Form.Label>Selected Columns from Partner Spreadsheet</Form.Label>
                      <Form.Control required type="text" placeholder="Select which columns to serve to students" defaultValue = {"default"} maxLength = {100} style = {{width: "500px"}} />
                      <Form.Text className="text-muted">
                        This will be a checkbox table
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


export default ConfigureSheets;











