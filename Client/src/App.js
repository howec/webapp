import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


// import Landing from './pages/Landing'
import Landing from './pages/landing/Landing'
import Partners from './pages/partners/Partners'
import Staff from './pages/staff/Staff';
import Students from './pages/students/Students';

import socket from './components/SocketUser';
// import Table from './components/Table'

//Join is login stuff


class App extends Component{
  constructor(props){
    super(props);
    console.log("in app constructor");

    /* 
    group values: null, Students, Staff, Partners
    */
    this.state = {url: null, loggedIn: false, group: null, profile: null, data: [{filler: "TO FILL WITH DATA", morefiller: "TO FILL WITH DATA2"}]};


    // const socket = this.socket;
    // console.log("LOOK HERE: " + socket);
    socket.emit('FINALLY', {msg: "event from App.js"});

  }


  onSignIn = (googleUser, pageName) => {
    //should I be configuring a "group?"


    //!!!!!TODO: need to make a function to get the url stuff
    let urlStuff = ["UC Berkeley Data Science", "https://data.berkeley.edu"];
    this.setState({url: urlStuff});



    console.log("SignedIn");
    this.setState({loggedIn: true});
    console.log("signed in! " + this.state.loggedIn);
            console.log("URL: " + this.state.url);


    //!!!!!TODO: some function to tell you what group the person belongs in
    this.setState({group: "Partners"})
    console.log("new group is: " + this.state.group);
    console.log("signed in! " + this.state.loggedIn);


    this.setState({profile: googleUser.getBasicProfile()});

    console.log('ID: ' + this.state.profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + this.state.profile.getName());
    console.log('Given Name: ' + this.state.profile.getGivenName());
    console.log('Email: ' + this.state.profile.getEmail()); // This is null if the 'email' scope is not present.

    console.log("Entered console.... "  + this.state.loggedIn);

    //login emission here
    socket.emit("loggedin", {email: this.state.profile.getEmail()});

  }

  onSignOut = () => {
    console.log("INSIDE THE SIGNOUT FUNCTION");
    this.setState({loggedIn: false, group: null, url: null});

    var auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });

    socket.emit('loggedout', {});
  }



/*
  failsafe way: store the pages as things in divs, and render everything but selectively hide
  
*/
  render(){
    console.log("inside app.js render..... " + this.state.url);

    return (
      <div>

        <Landing url = {["Applica", ""]} group = {this.state.group} loggedIn = {this.state.loggedIn} onSignIn = {this.onSignIn} onSignOut = {this.onSignOut} />
        <Staff url = {this.state.url} group = {this.state.group} loggedIn = {this.state.loggedIn} onSignIn = {this.onSignIn} onSignOut = {this.onSignOut} />
        <Students url = {this.state.url} group = {this.state.group} loggedIn = {this.state.loggedIn} onSignIn = {this.onSignIn} onSignOut = {this.onSignOut} />
        <Partners url = {this.state.url} group = {this.state.group} loggedIn = {this.state.loggedIn} onSignIn = {this.onSignIn} onSignOut = {this.onSignOut} />

      </div>


      )
  }

}


export default App;

// var test = document.getElementById("test");

// test.addEventListener("click", function(){
//   socket.emit("createWorkspace", "NAME", "URL");
//   console.log("Clicked workspace button");
// });

// console.log('before the emission');
// socket.emit('test', {testing: "0000"});

// socket.on("sendingattempt", function(data){
//   console.log("sending from within app.js");
//   console.log(data.attempt);

// });






