import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import GoogleLogin from 'react-google-login';

import socket from '../components/SocketUser';



class Login extends Component {

  constructor(props){
    super(props);
  }

  responseGoogle = (response) => {
    console.log("FAILED TO SIGN IN. " + JSON.stringify(response));
  }




  createWorkspaceHandler = () => {
    socket.emit("createWorkspace", "NAME", "URL");
    console.log("Clicked workspace button");

    console.log('before the emission');
    socket.emit('test', {testing: "0000"});

    socket.on("sendingattempt", function(data){
    console.log("sending from within app.js");
    console.log(data.attempt);

    });

  }

  render() {
    // if on the "Login" page
    if(this.props.page == "Login"){

      if(this.props.loggedIn == false){
      return(
        <div>

          <div>
            <h1> LOGIN PAGE </h1>
            <h2> create here </h2>
            <GoogleLogin
              clientId="273539098251-5nhctai82l0ram9s38gkp7s22ahc4lui.apps.googleusercontent.com"
              buttonText="Login"
              onSuccess={this.props.onSignIn}
              onFailure={this.responseGoogle}
              cookiePolicy={'single_host_origin'}
            />
          </div>

          <div>
            <button onClick = {this.createWorkspaceHandler}>Create a workspace</button>
          </div>

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
    //else do not show the "Login" page
    else{
      return null;
    }

  }
}

 




export default Login;


