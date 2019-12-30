import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import GoogleLogin from 'react-google-login';

import socket from '../../components/SocketUser';
import NavigationBar from '../../components/NavigationBar'

import Login from './subpages/Login'
import Create from './subpages/Create'
import Confirmation from './subpages/Confirmation'


class Landing extends Component {

  constructor(props){
    super(props);
    this.state = {page: "Login"};
  }


  toCreate = () => {
    this.setState({page: "Create"});
  }


  toLogin = () => {
    this.setState({page: "Login"});
  }


  toConfirmation = () => {
    this.setState({page: "Confirmation"});
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
            <Login page = {this.state.page} onSignIn = {this.props.onSignIn}/>
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





