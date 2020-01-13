import React, { Component } from 'react'

import socket from '../../../components/SocketUser';
import Table from '../../../components/Table'


class Home extends Component {
  
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
  	if(this.props.page == 'Home'){
	    return (
	    	<div>
				  <h1> [[Home]] subpage from PARTNERS. </h1>
          <p> display updates from staff... future implementation to allow for direct messaging with limited character count</p>
		    </div>
	    )
		} else {
    	return null
    }
  }

}


export default Home;










