import React, { Component } from 'react'
import {Link} from 'react-router-dom';

import socket from '../../../components/SocketUser';
import Table from '../../../components/Table'


class Students extends Component {

  constructor(props){
    super(props);

  }


  render() {

    if(this.props.page == 'Students'){
      return (
        <div>

          <h1> [[Students]] subpage from STAFF. </h1>

        </div>
        )
    }
    else {
      return null
    }

    }

}



export default Students;


