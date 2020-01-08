import React, { Component } from 'react'

import socket from '../../../components/SocketUser';
import Table from '../../../components/Table'
import { Button, Form, Col, FormGroup, Checkbox } from 'react-bootstrap'
import { Column, Row } from 'simple-flexbox';


class Staff extends Component {

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


  render() {
  	if(this.props.page === 'Staff'){
	    return (
	    	<div>

          <h1>Staff Configurations</h1>


          <Row>
            <p style={{marginTop: "10px", marginBottom: "4px"}}> Click <i>"Configure Sheets"</i> to finish setting up your workspace for use.</p>
          </Row>          
          <Row>
            <Button onClick = {this.props.toConfigureSheets}>Configure Sheets</Button> 
          </Row>

          <Row>
            <p style={{marginTop: "10px", marginBottom: "4px"}}>Click <i>"Configure Screenings"</i> to screen partners and students in advance.</p>
          </Row>
          <Row>
            <Button onClick = {this.props.toConfigureScreening}>Configure Screenings</Button> 
          </Row>

          <Row>
            <p style={{marginTop: "10px", marginBottom: "4px"}}>Click <i>"Configure Settings"</i> to change the banner in your Navigation Bar.</p>
          </Row>
          <Row>
            <Button onClick = {this.props.toConfigureBanner}>Configure Banner</Button> 
          </Row>

          <Row>
            <p style={{marginTop: "10px", marginBottom: "4px"}}>Click <i>"Delete Workspace"</i> to permanently delete your workspace.</p>
          </Row>
          <Row>
            <Button onClick = {this.props.toDeleteWorkspace}>Delete Workspace</Button> 
          </Row>



		    </div>
	    )
		} else{
    	return null;
    }
  }

}


export default Staff;











