import React, { Component } from 'react'

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


  toStaff = () => {
    if(this.props.loggedIn == true){
      this.changeState({page: "Staff"});
    }
  }


  toStudents = () => {
    if(this.props.loggedIn == true){
      this.changeState({page: "Students"});
    }
  }


  toPartners = () => {
    if(this.props.loggedIn == true){
      this.changeState({page: "Partners"});
    }
  }


  render() {
  	if(this.props.group == 'Staff'){
	    return (
	    	<div>
          <div>
		        <NavigationBar url = {this.props.url} loggedIn = {this.props.loggedIn} onSignOut = {this.props.onSignOut} navbarItems = {[[this.toHome, "Home"], [this.toStaff, "Staff"], [this.toPartners, "Partners"], [this.toStudents, "Students"]]}/>
				  </div>

          <div>
            <h1> Staff Page! </h1>
            <HomeSubpage page = {this.state.page}/>
            <StaffSubpage page = {this.state.page}/>
            <StudentsSubpage page = {this.state.page}/>
            <PartnersSubpage page = {this.state.page}/>
          </div>
		    </div>
	    )
		} else {
    	return null;
    }
  }

}


export default Staff;












