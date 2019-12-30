import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import GoogleLogin from 'react-google-login';

import socket from '../../../components/SocketUser';


class Login extends Component {

  constructor(props){
    super(props);
  }

  responseGoogleFail = (response) => {
    console.log("FAILED TO SIGN IN. " + JSON.stringify(response));
  }

  responseGoogleSucceed = (response) => {
    console.log("Succeeded signing in! " + JSON.stringify(response));
    console.log(response);

    this.props.onSignIn(response);
  }


  render() {
    // if on the "Login" page
    if(this.props.page == "Login"){
      return(
        <div>
          <div>
            <h1> LOGIN PAGE... text here + any pictures </h1>
            <GoogleLogin
              clientId="273539098251-5nhctai82l0ram9s38gkp7s22ahc4lui.apps.googleusercontent.com"
              buttonText="Login"
              onSuccess={this.responseGoogleSucceed}
              onFailure={this.responseGoogleFail}
              cookiePolicy={'single_host_origin'}
            />
          </div>
        </div>
      )
    } else{
      return null;
    }
  }

}


export default Login;











