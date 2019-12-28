import React, { Component } from 'react'
import {Link} from 'react-router-dom';

import socket from '../../components/SocketUser';
import NavigationBar from '../../components/NavigationBar'

import HomeSubpage from './subpages/Home'
import StaffSubpage from './subpages/Staff'
import StudentsSubpage from './subpages/Students'
import PartnersSubpage from './subpages/Partners'

class Staff extends Component {

  constructor(props){
    super(props);

    /*
      Page values: Home, Staff, Students, Partners
    */
    this.state = {page: "Home"}

  }


//need to readjust these to be in scope of this page
//props -> staff, and record the state and configure visibility in the render() function
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
          
          <HomeSubpage page = {this.state.page}/>
          <StaffSubpage page = {this.state.page}/>
          <StudentsSubpage page = {this.state.page}/>
          <PartnersSubpage page = {this.state.page}/>


		    </div>
	    	)
		}
    else {
    	return null
    }


  }
}


export default Staff;


