import { io } from "socket.io-client";

const socket = io("http://fabioscake.onrender.com/", {
  withCredentials: true,
  transports: ["polling"],
});

export default socket;
