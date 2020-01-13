import React, { Component } from 'react'

import socket from '../../../components/SocketUser';
import Table from '../../../components/Table'


class Profile extends Component {

  constructor(props){
    super(props);

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

  render() {
    if(this.props.page == 'Profile'){
      return (
        <div>
          <h1> [[Profile]] subpage from STUDENTS. </h1>
          <p> display student's own profile from google form in entirety... future implementation to allow for editing of responses </p>
        </div>
      )
    } else{
      return null;
    }
  }

}


export default Profile;








