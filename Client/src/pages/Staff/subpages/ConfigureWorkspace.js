import React, { Component } from 'react'

import socket from '../../../components/SocketUser';
import Table from '../../../components/Table'
import { Button, Form, Col, FormGroup, Checkbox } from 'react-bootstrap'


class ConfigureWorkspace extends Component {

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
  	if(this.props.page === 'ConfigureWorkspace'){
	    return (
	    	<div>
          <h1> inside configure workspace </h1>


		    </div>
	    )
		} else{
    	return null;
    }
  }

}


export default ConfigureWorkspace;











