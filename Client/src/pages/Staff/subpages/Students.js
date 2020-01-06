import React, { Component } from 'react'

import socket from '../../../components/SocketUser';
import Table from '../../../components/Table'


class Students extends Component {

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
    if(this.props.page == 'Students'){
      return (
        <div>
          <h1> [[Students]] subpage from STAFF. </h1>
        </div>
      )
    } else{
      return null
    }
  }

}


export default Students;








