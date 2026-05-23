import { io } from "socket.io-client";

const socket = io("http://fabioss.onrender.com", {
  withCredentials: true,
  transports: ["polling"],
});

export default socket;
