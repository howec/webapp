import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import GoogleLogin from 'react-google-login';

import socket from '../components/SocketUser';



class Login extends Component {

  constructor(props){
    super(props);

    this.state = {pages: props.pages};

  }

    responseGoogle = (response) => {
      console.log("FAILED TO SIGN IN. " + JSON.stringify(response));
    }



  render() {
    // const isLoggedIn = this.loggedIn;
    // if (isLoggedIn == false){
    if(this.props.loggedIn == false){
    return(
      <div>
        <h1> TEST </h1>
        <h2> create here </h2>
        <GoogleLogin
          clientId="273539098251-5nhctai82l0ram9s38gkp7s22ahc4lui.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={this.props.onSignIn}
          onFailure={this.responseGoogle}
          cookiePolicy={'single_host_origin'}
        />
      </div>
      )}
    else{
      return (
        <div>
          <h1> Logged in! </h1>
          <h2> create here </h2>
          <div></div>
          <button id = "SignOut" onClick = {this.props.onSignOut}> Sign Out Here </button> 
        </div>
      )
    }

  }
}

 




export default Login;


