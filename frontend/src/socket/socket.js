import { io } from "socket.io-client";


const URl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000"

const socket = io( URl,{withCredentials:true})

export default socket
