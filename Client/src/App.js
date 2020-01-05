import React, { Component } from 'react';

import LoginLanding from './pages/landing/LoginLanding'
import PartnersLanding from './pages/partners/PartnersLanding'
import StaffLanding from './pages/staff/StaffLanding';
import StudentsLanding from './pages/students/StudentsLanding';

import socket from './components/SocketUser';


class App extends Component{

  constructor(props){
    super(props);
    console.log("in app constructor");

    /* 
    group values: null, Students, Staff, Partners
    */
    this.state = {logsign: null, url: null, loggedIn: false, group: null, profile: null, data: null};

    socket.emit('FINALLY', {msg: "event from App.js"});
  }

  setData = (d) =>{
    this.setState({data: d});
  }

  //To delete
  setGroupApp = (g) =>{
    this.setState({group: g});
  }

  onLogIn = (group, urlList, data) => {
    //urlList and data currently not set
    let urlStuff = ["UC Berkeley Data Science", "https://data.berkeley.edu"];
    this.setState({logsign: "Normal"});
    this.setState({url: urlStuff}); // HOWE
    this.setState({loggedIn: true});
    this.setState({group: group});


    this.setState({data: data});//HOWE
  }

  onSignIn = (googleUser) => {
    //should I be configuring a "group?"
    this.setState({logsign: "Google"});


    //!!!!!TODO: need to make a function to get the url stuff, input from staff
    let urlStuff = ["UC Berkeley Data Science", "https://data.berkeley.edu"];
    this.setState({url: urlStuff});

    console.log("SignedIn");
    this.setState({loggedIn: true});
    console.log("signed in! " + this.state.loggedIn);
            console.log("URL: " + this.state.url);


    //!!!!!TODO: some function to tell you what group the person belongs in
    this.setState({group: "Staff"})
    console.log("new group is: " + this.state.group);
    console.log("signed in! " + this.state.loggedIn);


    this.setState({profile: googleUser.getBasicProfile()});

    console.log('ID: ' + this.state.profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + this.state.profile.getName());
    console.log('Given Name: ' + this.state.profile.getGivenName());
    console.log('Email: ' + this.state.profile.getEmail()); // This is null if the 'email' scope is not present.

    console.log("Entered console.... "  + this.state.loggedIn);

    //HOWE: this should actually be the authentication stuff
    //login emission here... this is BEFORE any authentication
    socket.emit("gLoginSubmitted", {email: this.state.profile.getEmail()});

    socket.on("sendingattempt", (data) =>{
      console.log("IN SENDING ATTEMPT");
        console.log(data);
        this.setState({data: data["attempt"]});
        console.log("From within the set state.... " + JSON.stringify(this.state.data));

    });
    //function to get the corresponding row entry from the appropriate sheet

  }


  gSignOut = () => {
    console.log("INSIDE THE SIGNOUT FUNCTION");
    this.setState({logsign: null, loggedIn: false, group: null, url: null});

    var auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });

    socket.emit('loggedout', {});
  }

  nLogOut = () => {
    console.log("INSIDE THE SIGNOUT FUNCTION");
    this.setState({logsign: null, loggedIn: false, group: null, url: null});

    socket.emit('loggedout', {});
  }

  onSignOut = () =>{
    if(this.state.logsign == "Normal"){
      return this.nLogOut();
    } else{
      return this.gSignOut;
    }
  }




/*
  failsafe way: store the pages as things in divs, and render everything but selectively hide
*/
  render(){
    console.log("inside app.js render..... " + this.state.url);
    return (
      <div>
        <LoginLanding
          url = {["Applica", ""]}
          group = {this.state.group}
          loggedIn = {this.state.loggedIn}
          onLogIn = {this.onLogIn}
          onSignIn = {this.onSignIn}
          onSignOut = {this.onSignOut} />
        <StaffLanding
          url = {this.state.url}
          group = {this.state.group}
          loggedIn = {this.state.loggedIn}
          onSignIn = {this.onSignIn}
          onSignOut = {this.onSignOut}
          data = {this.state.data} />
        <StudentsLanding
          url = {this.state.url}
          group = {this.state.group}
          loggedIn = {this.state.loggedIn}
          onSignIn = {this.onSignIn}
          onSignOut = {this.onSignOut}
          data = {this.state.data} />
        <PartnersLanding
          url = {this.state.url}
          group = {this.state.group}
          loggedIn = {this.state.loggedIn}
          onSignIn = {this.onSignIn}
          onSignOut = {this.onSignOut}
          data = {this.state.data} />
      </div>
    )
  }

}


export default App;








