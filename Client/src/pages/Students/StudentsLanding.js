import React, { Component } from 'react'

import socket from '../../components/SocketUser';
import Table from '../../components/Table'
import NavigationBar from '../../components/NavigationBar'

import HomeSubpage from './subpages/Home'
import ApplicationsSubpage from './subpages/Applications'
import ProfileSubpage from './subpages/Profile'


class Students extends Component {

  constructor(props){
    super(props);

    /*
      Page values: Home, Applications, Profile
    */
    this.state = {page: "Home"}
  }


  toHome = () => {
    if(this.props.loggedIn == true){
      this.setState({page: "Home"});
    }
  }


  toApplications = () => {
    if(this.props.loggedIn == true){
      this.setState({page: "Applications"});
    }
  }
  
  toProfile = () => {
    if(this.props.loggedIn == true){
      this.setState({page: "Profile"});
    }
  }


  render() {
  	if(this.props.group == 'Students'){
	    return (
	    	<div>
          <div>
            <NavigationBar
              url = {this.props.url}
              loggedIn = {this.props.loggedIn}
              onSignOut = {this.props.onSignOut}
              navbarItems = {[[this.toHome, "Home"], [this.toApplications, "Applications"], [this.toProfile, "Profile"]]}/>
				  </div>

          <div>
            <h1> Students page! </h1>
            <HomeSubpage page = {this.state.page}/>
            <ApplicationsSubpage page = {this.state.page}/>
            <ProfileSubpage page = {this.state.page}/>
          </div>
		    </div>
	    )
		} else{
    	return null;
    }
  }

}


export default Students;











