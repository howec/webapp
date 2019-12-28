import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import GoogleLogin from 'react-google-login';

import socket from '../../components/SocketUser';
import NavigationBar from '../../components/NavigationBar';


import CreateSubpage from './subpages/Create';
import LoginSubpage from './subpages/Login';

class Landing extends Component {

  constructor(props){
    super(props);

    this.state = {page: "Landing"}
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
    if(this.props.group==null){
      return(

        <div>
          <NavigationBar url = {this.props.url} loggedIn = {false} onSignOut = {null} navbarItems = {null}/>



          <LoginSubpage page={this.state.page} onSignIn = {this.props.onSignIn} />
          <CreateSubpage page={this.state.page} />
        </div>

        )
    }
    //else do not show the "Login" page
    else{
      return null;
    }

  }
}



export default Landing;


