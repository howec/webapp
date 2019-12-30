import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';

import socket from '../../../components/SocketUser';


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

    socket.on("workspaceStatus", function(data){
      console.log("SKJSLKDJSKDJLKSJFKL: " + data.msg);
    })

  }


  formSubmit = () => {
    this.createWorkspaceHandler();

    this.props.toConfirmation();

  }


  render() {
    if(this.props.page == "Create"){
      return(
        <div>
          <h1> Should be in Create now </h1>
          <h2> create here </h2>
          <button onClick = {this.formSubmit}>Create a workspace</button>
        </div>
      )
    } else{
      return null;
    }    
  }

}


export default Create;










