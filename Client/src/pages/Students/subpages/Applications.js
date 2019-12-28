import React, { Component } from 'react'
import {Link} from 'react-router-dom';

import socket from '../../../components/SocketUser';
import Table from '../../../components/Table'


class Applications extends Component {

  constructor(props){
    super(props);

  }


  render() {

    if(this.props.page == 'Applications'){
      return (
        <div>

          <h1> [[Applications]] subpage from STUDENTS. </h1>

        </div>
        )
    }
    else {
      return null
    }

    }

}



export default Applications;


