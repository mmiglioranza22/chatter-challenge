import { io } from "socket.io-client";


const socket = io('http://localhost:8080')

socket.on('connection', () => {
  // eslint-disable-next-line no-console
  console.log('Conectado a socket del servidor')
})

socket.on('disconnection', () => {
  console.log('Connection with server lost')
})

export default socket