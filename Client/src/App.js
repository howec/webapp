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
  }

  _isMounted=false;
  
  componentDidMount(){
   this._isMounted=true;
  }

  componentWillUnmount(){
    this._isMounted=false;
  }

  changeState(data){
    if(this._isMounted){
      this.setState(data)
    }
  }

  changeBannerNameURL = (name, url) => {
    let urlStuff = [name, url];
    this.changeState({url:urlStuff});
  }

  setData = (d) =>{
    this.changeState({data: d});
  }

  //To delete
  setGroupApp = (g) =>{
    this.changeState({group: g});
  }


  //data currently not set... does it need to be set on login?
  onLogIn = (group, urlList, data) => {

    this.changeState({logsign: "Normal"});
    this.changeState({url: urlList}); // HOWE
    this.changeState({loggedIn: true});
    this.changeState({group: group});

    this.changeState({data: data});//HOWE
  }


//Have not fully implemented oauth because I would need to use my own personal email
//and cc info.
//I have an alternative account set up, but I need division cc info to configure
//google developer console access
  onSignIn = (googleUser) => {
    this.changeState({logsign: "Google"});


    //!!!!!HOWE: need to make a function to get the url stuff, input from staff
    let urlStuff = ["UC Berkeley Data Science", "https://data.berkeley.edu"];
    this.changeState({url: urlStuff});


    /*
    let gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)  
         .requestIdToken(getString(R.string.server_client_id))  
         .requestEmail()  
         .build();  
    */



    //HOWE: to change and move below
    console.log("SignedIn");
    this.changeState({loggedIn: true});


    //!!!!!HOWE: some function to tell you what group the person belongs in
    this.changeState({group: "Partners"})
    console.log("new group is: " + this.state.group);
    console.log("signed in! " + this.state.loggedIn);


    this.changeState({profile: googleUser.getBasicProfile()});

    console.log('ID: ' + this.state.profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + this.state.profile.getName());
    console.log('Given Name: ' + this.state.profile.getGivenName());
    console.log('Email: ' + this.state.profile.getEmail()); // This is null if the 'email' scope is not present.


    //HOWE: this should actually be the authentication stuff
    socket.emit("gLoginSubmitted", {email: this.state.profile.getEmail()});

    //this is where login needs to be configured... dependent on whether the server recognized
    //sent credentials from client
    socket.on("sendingattempt", (data) =>{
    //HOWE: to change and move below
    // console.log("SignedIn");
    // this.changeState({loggedIn: true});


      console.log("IN SENDING ATTEMPT");
        console.log(data);
        this.changeState({data: data["attempt"]});
        console.log("From within the set state.... " + JSON.stringify(this.state.data));

        //within set state

    });
  }


  gSignOut = () => {
    console.log("INSIDE THE SIGNOUT FUNCTION");
    this.changeState({logsign: null, loggedIn: false, group: null, url: null});

    var auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });

    socket.emit('loggedout', {});
  }

  nLogOut = () => {
    console.log("INSIDE THE SIGNOUT FUNCTION");
    this.changeState({logsign: null, loggedIn: false, group: null, url: null});

    socket.emit('loggedout', {});
  }

  onSignOut = () =>{
    if(this.state.logsign === "Normal"){
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
          onSignOut = {null} />
        <StaffLanding
          changeBannerNameURL = {this.changeBannerNameURL}
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








