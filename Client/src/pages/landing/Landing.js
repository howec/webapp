import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import GoogleLogin from 'react-google-login';

import socket from '../../components/SocketUser';
import NavigationBar from '../../components/NavigationBar'

import Login from './subpages/Login'
import Create from './subpages/Create'


class Landing extends Component {

  constructor(props){
    super(props);
    this.state = {page: "Login"};
  }


  toWorkspaceCreation = () => {
    this.setState({page: "Create"});
  }

  toLanding = () => {
    this.setState({page: "Login"});
  }


  render() {
    // if on the "Login" page
    if(this.props.group == null){
      if(this.state.page == "Login"){
        return(
          <div>
            <NavigationBar url = {this.props.url} loggedIn = {false} onSignOut = {null} navbarItems = {[[this.toWorkspaceCreation, "Create a workspace"]]}/>
            <Login url = {this.props.url} group = {this.props.group} loggedIn = {this.props.loggedIn} onSignIn = {this.props.onSignIn} onSignOut = {this.props.onSignOut} />
          </div>

          );
      }
      //else do not show the "Login" page
      else if (this.state.page == "Create"){
        return (
          <div>
            <NavigationBar url = {this.props.url} loggedIn = {false} onSignOut = {null} navbarItems = {null}/>
            <Create toLanding = {this.toLanding}/>
        </div>

        );
      }
      else{
        return (
          <h1> No idea what happened </h1>
          );
      }

  }
  else{
    return null;

  }

  }
}

 




export default Landing;



