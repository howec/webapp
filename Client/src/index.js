import './index.css'

import React from 'react';
import ReactDOM from 'react-dom';
import GoogleLogin from 'react-google-login';

import socket from './components/SocketUser';
import App from './App';


ReactDOM.render(<App />, document.getElementById('root'));
// ReactDOM.render(<App />, document.querySelector('#root'));



//implement way to prevent ddos attacks later.... max amount of workspaces per user
//test whether I can create "account"





