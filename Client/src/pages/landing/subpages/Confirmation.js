import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import GoogleLogin from 'react-google-login';

import socket from '../../../components/SocketUser';
import NavigationBar from '../../../components/NavigationBar'



class Confirmation extends Component {

  constructor(props){
    super(props);
  }

  responseGoogle = (response) => {
    console.log("FAILED TO SIGN IN. " + JSON.stringify(response));
  }


  formSubmit = () => {

    this.props.toLanding();

  }

  render() {
    // if on the "Confirmation" page
    if(this.props.page == "Confirmation"){
      return(
          <div>
                <h1> Should be in Confirmation now </h1>
                <h2> Confirmation message based on whether it was successful, name taken, or exists already </h2>

            <button onClick = {this.formSubmit}>Return to Applica</button>
          </div>
          );
      }else{
        return null;
      }
    

    }
  }

export default Confirmation;


