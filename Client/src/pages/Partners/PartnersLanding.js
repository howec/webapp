import React, { Component } from 'react'

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


  toHome = () => {
    if(this.props.loggedIn == true){
      this.setState({page: "Home"})
    }
  }


  toApplicants = () => {
    if(this.props.loggedIn == true){
      this.setState({page: "Applicants"})
    }
  }


  toProfile = () => {
    if(this.props.loggedIn == true){
      this.setState({page: "Profile"})
    }
  }


  render(){
  	if(this.props.group == 'Partners'){
	    return (
	    	<div>
          <NavigationBar url = {this.props.url} loggedIn = {this.props.loggedIn} onSignOut = {this.props.onSignOut} navbarItems = {[[this.toHome, "Home"], [this.toApplicants, "Applicants"], [this.toProfile, "Profile"]]}/>
				  <h1> Partners page! </h1>
          <HomeSubpage page = {this.state.page}/>
          <ApplicantsSubpage page = {this.state.page}/>
          <ProfileSubpage page = {this.state.page}/>
		    </div>
	    )
		}
    else {
    	return null;
    }
  }

}


export default Partners;











