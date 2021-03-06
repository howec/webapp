import React, { Component } from 'react'

import socket from '../../components/SocketUser';
import NavigationBar from '../../components/NavigationBar'

import HomeSubpage from './subpages/Home'
import StaffSubpage from './subpages/Staff'
import StudentsSubpage from './subpages/Students'
import PartnersSubpage from './subpages/Partners'

import ConfigureBanner from './subpages/ConfigureBanner'
import ConfigureSheets from './subpages/ConfigureSheets'
import ConfigureScreening from './subpages/ConfigureScreening'
import ConfigureWorkspace from './subpages/ConfigureWorkspace'

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
    if(this.props.loggedIn === true){
      this.changeState({page: "Home"});
    }
  }


  toStaff = () => {
    if(this.props.loggedIn === true){
      this.changeState({page: "Staff"});
    }
  }


  toStudents = () => {
    if(this.props.loggedIn === true){
      this.changeState({page: "Students"});
    }
  }


  toPartners = () => {
    if(this.props.loggedIn === true){
      this.changeState({page: "Partners"});
    }
  }

  toConfigureBanner = () => {
    if(this.props.loggedIn === true){
      this.changeState({page: "ConfigureBanner"});
    }
  }

  toConfigureSheets = () => {
    if(this.props.loggedIn === true){
      this.changeState({page: "ConfigureSheets"});
    }
  }

  toConfigureScreening = () => {
    if(this.props.loggedIn === true){
      this.changeState({page: "ConfigureScreening"});
    }
  }

  toConfigureWorkspace = () => {
    if(this.props.loggedIn === true){
      this.changeState({page: "ConfigureWorkspace"});
    }
  }

  onSignOut = () => {
    this.changeState({page: "Home"});
    this.props.onSignOut();
  }


//    let urlStuff = ["UC Berkeley Data Science", "https://data.berkeley.edu"];

  render() {
  	if(this.props.loggedIn === true && this.props.group === 'Staff'){
	    return (
	    	<div>
          <div>
		        <NavigationBar
            url = {this.props.url}
            loggedIn = {this.props.loggedIn}
            onSignOut = {this.onSignOut}
            navbarItems = {[[this.toHome, "Home"], [this.toStaff, "Staff"], [this.toPartners, "Partners"], [this.toStudents, "Students"]]}/>
				  </div>

          <div style = {{margin: "50px"}}>
            <HomeSubpage page = {this.state.page}/>
            <StaffSubpage
              toConfigureBanner = {this.toConfigureBanner}
              toConfigureSheets = {this.toConfigureSheets}
              toConfigureScreening = {this.toConfigureScreening}
              toConfigureWorkspace = {this.toConfigureWorkspace}
              page = {this.state.page}/>
                <ConfigureBanner
                  url = {this.props.url}
                  page = {this.state.page} 
                  changeBannerNameURL = {this.props.changeBannerNameURL} />
                <ConfigureSheets page = {this.state.page} />
                <ConfigureScreening page = {this.state.page} />
                <ConfigureWorkspace page = {this.state.page} />
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












