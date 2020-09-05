import socketIOClient from 'socket.io-client';

const ENDPOINT = process.env.REACT_APP_SOCKET_HOST;
let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = socketIOClient(ENDPOINT);
  }
  return socket;
}
