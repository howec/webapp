import React, { Component } from 'react';

import socket from '../../../components/SocketUser';


class Confirmation extends Component {

  constructor(props){
    super(props);
  }


  responseGoogle = (response) => {
    console.log("FAILED TO SIGN IN. " + JSON.stringify(response));
  }


  returnSubmit = () => {
    this.props.toLanding();
  }


  render() {
    if(this.props.page == "Confirmation"){
      return(
        <div>
          <h1> Should be in Confirmation now </h1>
          <h2> Confirmation message based on whether it was successful, name taken, or exists already </h2>
          <button onClick = {this.returnSubmit}>Return to Applica</button>
        </div>
      );
    } else{
      return null;
    }
  }

}


export default Confirmation;









