import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import GoogleLogin from 'react-google-login';

import socket from '../../../components/SocketUser';
import NavigationBar from '../../../components/NavigationBar'



class Create extends Component {

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
      return(
          <div>
                <h1> Should be in Create now </h1>
                        <h2> create here </h2>

            <button onClick = {this.createWorkspaceHandler}>Create a workspace</button>
          </div>
          );
    

    }
  }

export default Create;


