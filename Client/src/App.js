import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import NavigationBar from './components/NavigationBar'

import Login from './pages/Login'
import Partners from './pages/Partners'
import Staff from './pages/Staff';
import Students from './pages/Students';

import socket from './components/SocketUser';
// import Table from './components/Table'

//Join is login stuff


class App extends Component{
  constructor(props){
    super(props);
    console.log("in app constructor");
    console.log(props.data);

    /* 
    page values: login, students, staff, partners
    */
    this.state = {loggedIn: false, profile: null, page: 'login', data: [{filler: "TO FILL WITH DATA", morefiller: "TO FILL WITH DATA2"}]};

    // const socket = this.socket;
    // console.log("LOOK HERE: " + socket);
    socket.emit('FINALLY', {msg: "event from App.js"});

  }


  onSignIn = (googleUser) => {
    this.setState({loggedIn: true});
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
    this.setState({loggedIn: false});

    var auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }


//componentDidUpdate
//if 

  // componentDidMount(){
  //   socket.on("sendingattempt", req => {
  //     this.state.data = [req.attempt];
  //     this.setState(this.state);
  //   });
  // }


/*
  failsafe way: store the pages as things in divs, and render everything but selectively hide
  
*/
  render(){
    return (
      <div>
        <NavigationBar />

        <Login page = {this.state.page} />
        <Staff page = {this.state.page} />
        <Students page = {this.state.page} />
        <Partners page = {this.state.page} />

      </div>


      )


/*
    return(
      <div>
      <NavigationBar loggedIn = {this.state.loggedIn}/>

      <Router>
        <Switch>
          <Route exact path="/" >
            <Login loggedIn = {this.state.loggedIn} onSignIn = {this.onSignIn} onSignOut = {this.onSignOut}/>
          </Route>
          
          <Route exact path="/Login">
            <Login loggedIn = {this.state.loggedIn} onSignIn = {this.onSignIn} onSignOut = {this.onSignOut}/>
          </Route>

          <Route exact path="/staff" >
            <Staff/>
          </Route>

          <Route exact path="/students" >
            <Students/>
          </Route>

          <Route exact path="/partners">
            <Partners/>
          </Route>

        </Switch>
       </Router>

    </div>


    */
  }

}


export default App;

var test = document.getElementById("test");

test.addEventListener("click", function(){
  socket.emit("createWorkspace", "NAME", "URL");
  console.log("Clicked workspace button");
});

console.log('before the emission');
socket.emit('test', {testing: "0000"});

socket.on("sendingattempt", function(data){
  console.log("sending from within app.js");
  console.log(data.attempt);

});






