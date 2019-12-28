import React, { Component } from 'react'
import {Link} from 'react-router-dom';

import NavigationBar from '../../components/NavigationBar'

import HomeSubpage from './subpages/Home'
import ApplicantsSubpage from './subpages/Applicants'
import ProfileSubpage from './subpages/Profile'


class Partners extends Component {

  constructor(props){
    super(props);

    /*
      Page values: Home, Applicants, Profile
    */
    this.state = {page: "Home"}

  }


//need to readjust these to be in scope of this page
  toHome = () =>{
    console.log("In 1");
    if(this.props.loggedIn == true){
      this.setState({page: "Home"})
    }
  }
  toApplicants = () =>{
        console.log("In 2");

    if(this.props.loggedIn == true){
      this.setState({page: "Applicants"})
    }
  }
  toProfile = () =>{
    console.log("In 3");

    if(this.props.loggedIn == true){
      this.setState({page: "Profile"})
    }
  }



  render() {
  	if(this.props.group == 'Partners'){
	    return (
	    	<div>
          <NavigationBar loggedIn = {this.props.loggedIn} onSignOut = {this.props.onSignOut} navbarItems = {[[this.toHome, "Home"], [this.toApplicants, "Applicants"], [this.toProfile, "Profile"]]}/>


				  <h1> Partners page! </h1>

          <HomeSubpage page = {this.state.page}/>
          <ApplicantsSubpage page = {this.state.page}/>
          <ProfileSubpage page = {this.state.page}/>



		    </div>
	    	)
		}
    else {
    	return null
    }

  }
}



export default Partners;


