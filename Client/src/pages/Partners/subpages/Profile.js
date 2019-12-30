import React, { Component } from 'react'

import socket from '../../../components/SocketUser';
import Table from '../../../components/Table'
import Document from '../../../components/Document'


class Profile extends Component {

  constructor(props){
    super(props);

  }


  render() {
    if(this.props.page == 'Profile'){
      return (
        <div>
          <h1> [[Profile]] subpage from PARTNERS. </h1>
          <Table data = {[this.props.data]} />
        </div>
      )
    } else {
      return null;
    }
  }

}



export default Profile;









