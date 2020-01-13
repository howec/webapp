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
  	if(this.props.page === 'ConfigureScreening'){
	    return (
	    	<div>
          <h1> inside configure screening </h1>
          <p> this page is dedicated to approving/rejecting partners and rejecting/marking students of interest </p>

		    </div>
	    )
		} else{
    	return null;
    }
  }

}


export default ConfigureScreening;











