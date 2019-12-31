import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import GoogleLogin from 'react-google-login';

import socket from '../../components/SocketUser';
import NavigationBar from '../../components/NavigationBar'

import Login from './subpages/Login'
import Create from './subpages/Create'
import Confirmation from './subpages/Confirmation'
import LoginAs from './subpages/LoginAs'
import LoginAsStudent from './subpages/LoginAsStudent'
import LoginAsStaff from './subpages/LoginAsStaff'
import LoginAsPartner from './subpages/LoginAsPartner'


class Landing extends Component {

  constructor(props){
    super(props);
    this.state = {page: "Login", step: null};
  }


  toCreate = () => {
    this.setState({page: "Create"});
  }


  toLogin = () => {
    this.setState({page: "Login"});
  }

  toLoginAs = () => {
    this.setState({step: "LoginAs"});
  }

  toLoginAsStudent = () => {
    this.setState({step: "LoginAsStudent"});
  }

  toLoginAsStaff = () => {
    this.setState({step: "LoginAsStaff"});
  }

  toLoginAsPartner = () => {
    this.setState({step: "LoginAsPartner"});
  }

  toConfirmation = () => {
    this.setState({step: "Confirmation"});
  }


  render() {
    // if on the "Login" page
    if(this.props.group == null){
      if(this.state.page == "Login"){
        return(
          <div>
            <NavigationBar
              url = {this.props.url}
              loggedIn = {false}
              onSignOut = {null}
              navbarItems = {[[this.toCreate, "Create a workspace"]]}/>
            
            <Login toLoginAs = {this.toLoginAs} step= {this.state.step} page = {this.state.page} onSignIn = {this.props.onSignIn}/>
            <LoginAs
              step={this.state.step}
              toLoginAsPartner={this.toLoginAsPartner}
              toLoginAsStaff={this.toLoginAsStaff}
              toLoginAsStudent={this.toLoginAsStudent}/>
            <LoginAsStaff step = {this.state.step} />
            <LoginAsStudent step = {this.state.step} />
            <LoginAsPartner step = {this.state.step} />

          </div>
        )
      } else if(this.state.page == "Create"){
        return (
          <div>
            <NavigationBar
              url = {this.props.url}
              loggedIn = {false}
              onSignOut = {null}
              navbarItems = {null}/>
            <Create page = {this.state.page} toConfirmation = {this.toConfirmation}/>
          </div>
        )
      } else if(this.state.page == "Confirmation"){
        return (
          <div>
            <NavigationBar
              url = {this.props.url}
              loggedIn = {false}
              onSignOut = {null}
              navbarItems = {null}/>
            <Confirmation page = {this.state.page} toLanding = {this.toLogin}/>
          </div>
        )
      } else{
        return (
          <h1> No idea what happened </h1>
        )
      }
  } else {
    return null;
    }
  }

}


export default Landing;





