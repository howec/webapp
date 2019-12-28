import React, { Component } from 'react'
import {Link} from 'react-router-dom';

import socket from '../../../components/SocketUser';
import Table from '../../../components/Table'


class Profile extends Component {

  constructor(props){
    super(props);

  }


  render() {

    if(this.props.page == 'Profile'){
      return (
        <div>

          <h1> [[Profile]] subpage from STUDENTS. </h1>

        </div>
        )
    }
    else {
      return null
    }

    }

}



export default Profile;


