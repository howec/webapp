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


  toHome = () => {
    if(this.props.loggedIn == true){
      this.changeState({page: "Home"});
    }
  }


  toApplications = () => {
    if(this.props.loggedIn == true){
      this.changeState({page: "Applications"});
    }
  }
  
  toProfile = () => {
    if(this.props.loggedIn == true){
      this.changeState({page: "Profile"});
    }
  }


  onSignOut = () => {
    this.changeState({page: "Home"});
    this.props.onSignOut();
  }


  render() {
  	if(this.props.loggedIn === true && this.props.group == 'Students'){
	    return (
	    	<div>
          <div>
            <NavigationBar
              url = {this.props.url}
              loggedIn = {this.props.loggedIn}
              onSignOut = {this.onSignOut}
              navbarItems = {[[this.toHome, "Home"], [this.toApplications, "Applications"], [this.toProfile, "Profile"]]}/>
				  </div>

          <div style = {{margin: "50px"}}>
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











