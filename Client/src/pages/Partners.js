import React, { Component } from 'react'
import {Link} from 'react-router-dom';

import socket from '../components/SocketUser';


class Partners extends Component {

  constructor(props){
    super(props);

  }

  render() {
  	if(this.props.page == 'Partners'){
	    return (
	    	<div>
				<h1> partners page </h1>
		    </div>
	    	)
		}
    else {
    	return null
    }

  }
}



export default Partners;


