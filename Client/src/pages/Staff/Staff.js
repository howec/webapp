import React, { Component } from 'react'
import {Link} from 'react-router-dom';

import socket from '../../components/SocketUser';
import NavigationBar from '../../components/NavigationBar'


class Staff extends Component {

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
  toStaff = () =>{
        console.log("In 2");

    if(this.props.loggedIn == true){
      this.setState({page: "Staff"})
    }
  }
  toStudents = () =>{
    console.log("In 3");

    if(this.props.loggedIn == true){
      this.setState({page: "Students"})
    }
  }
  toPartners = () =>{
        console.log("In 4");

    if(this.props.loggedIn == true){
      this.setState({page: "Partners"})
    }

  }


  render() {


  	if(this.props.group == 'Staff'){
	    return (

	    	<div>
		      <NavigationBar loggedIn = {this.props.loggedIn} onSignOut = {this.props.onSignOut} navbarItems = {[[this.toHome, "Home"], [this.toStaff, "Staff"], [this.toPartners, "Partners"], [this.toStudents, "Students"]]}/>



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


