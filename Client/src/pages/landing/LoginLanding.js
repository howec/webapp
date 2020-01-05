import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import GoogleLogin from 'react-google-login';

import socket from '../../components/SocketUser';
import NavigationBar from '../../components/NavigationBar'

import Login from './subpages/Login'
import Create from './subpages/Create'
import Confirmation from './subpages/Confirmation'
import { Column, Row } from 'simple-flexbox';


class Landing extends Component {

  constructor(props){
    super(props);
    this.state = {page: "Login"};
  }

  toCreate = () => {
    this.setState({page: "Create"});
  }

  toConfirmation = () => {
    this.setState({page: "Confirmation"});
  }

  toLogin = () => {
    this.setState({page: "Login"});
  }


  render() {
    // if on the "Login" page
    if(this.props.group == null){
      if(this.state.page == "Login"){
        return(
          <div>
            <div>
              <NavigationBar
                url = {this.props.url}
                loggedIn = {false}
                onSignOut = {null}
                navbarItems = {[[this.toCreate, "Create a workspace"]]}/>
             </div>

            <div>
              <Login
                page = {this.state.page}
                onLogIn = {this.props.onLogIn}
                onSignIn = {this.props.onSignIn}/>
              </div>
          </div>
        )
      } else if(this.state.page == "Create"){
        return (
          <div>
            <div>
              <NavigationBar
                url = {this.props.url}
                loggedIn = {false}
                onSignOut = {null}
                navbarItems = {null}/>
              </div>

            <div>
              <Create page = {this.state.page} toConfirmation = {this.toConfirmation}/>
            </div>
          </div>
        )
      } else if(this.state.page == "Confirmation"){
        return (
          <div>
            <div>
              <NavigationBar
                url = {this.props.url}
                loggedIn = {false}
                onSignOut = {null}
                navbarItems = {null}/>
              </div>

            <div>
              <Confirmation page = {this.state.page} toLanding = {this.toLogin}/>
            </div>
          </div>
        )
      } else{
        return (
          <h1> No idea what happened </h1>
        )
      }
  } else {
    return null;
    }
  }

}


export default Landing;





