import React, { Component } from 'react'

import socket from '../../../components/SocketUser';
import Table from '../../../components/Table'


class Applications extends Component {

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
    if(this.props.page == 'Applications'){
      return (
        <div>
          <h1> [[Applications]] subpage from STUDENTS. </h1>
          <p> display student's application status decision from partner inputs </p>
        </div>
      )
    } else{
      return null;
    }
  }

}


export default Applications;








