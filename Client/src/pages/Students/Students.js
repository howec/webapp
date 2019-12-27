import React, { Component } from 'react'
import {Link} from 'react-router-dom';

import socket from '../../components/SocketUser';
import Table from '../../components/Table'
import NavigationBar from '../../components/NavigationBar'


class Students extends Component {

  constructor(props){
    super(props);

  }


//need to readjust these to be in scope of this page
  toHome = () =>{
    console.log("In 1");
    if(this.props.loggedIn == true){
      this.setState({page: "Home"})
    }
  }
  toApplications = () =>{
        console.log("In 2");

    if(this.props.loggedIn == true){
      this.setState({page: "Applications"})
    }
  }
  toProfile = () =>{
    console.log("In 3");

    if(this.props.loggedIn == true){
      this.setState({page: "Profile"})
    }
  }


  render() {

  	if(this.props.group == 'Students'){
	    return (
	    	<div>
          <NavigationBar loggedIn = {this.props.loggedIn} onSignOut = {this.props.onSignOut} navbarItems = {[[this.toHome, "Home"], [this.toApplications, "Applications"], [this.toProfile, "Profile"]]}/>


				  <h1> STUDENT STUFF ARJHSD </h1>
		    </div>
	    	)
		}
    else {
    	return null
    }

  	}

}






export default Students;


