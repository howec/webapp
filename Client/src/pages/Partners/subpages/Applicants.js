import React, { Component } from 'react'

import socket from '../../../components/SocketUser';
import Table from '../../../components/Table'


class Applicants extends Component {

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
    if(this.props.page == 'Applicants'){
      return (
        <div>
          <h1> [[Applicants]] subpage from PARTNERS. </h1>
          <p> include download of csv file here, dictated by their relevant info (as described by selected columns by staff)</p>
          <p> list all of the students and a box to indicate interest.</p>
          <p> by each student, also indicate their progress on whether they've accepted a request or not </p>
        </div>
      )
    } else {
      return null
    }
  }

}


export default Applicants;








