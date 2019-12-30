import React, { Component } from 'react'

import socket from '../../../components/SocketUser';
import Table from '../../../components/Table'


class Home extends Component {

  constructor(props){
    super(props);

  }


  render() {
  	if(this.props.page == 'Home'){
	    return (
	    	<div>
				  <h1> [[Home]] subpage from STAFF. </h1>
		    </div>
	    )
		} else{
    	return null;
    }
  }

}


export default Home;









