import io from 'socket.io-client';

const ENDPOINT = 'localhost:5001';
var socket = io(ENDPOINT);

export default socket;


