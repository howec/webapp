import React, { Component } from 'react'

import socket from '../../../components/SocketUser';
import Table from '../../../components/Table'


class Applicants extends Component {

  constructor(props){
    super(props);
  }


  render() {
    if(this.props.page == 'Applicants'){
      return (
        <div>
          <h1> [[Applicants]] subpage from PARTNERS. </h1>
        </div>
      )
    } else {
      return null
    }
  }

}


export default Applicants;








