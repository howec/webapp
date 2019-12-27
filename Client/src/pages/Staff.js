import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import socket from '../components/SocketUser';


class Staff extends Component {

  constructor(props){
    super(props);

  }

  render() {
  	if(this.props.page == 'Staff'){
	    return (
	    	<div>
				<h1> Staff Page! </h1>
		    </div>
	    	)
		}
    else {
    	return null
    }


  }
}


export default Staff;


