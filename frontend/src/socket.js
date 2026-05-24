import { io } from "socket.io-client";

const socket = io("${import.meta.env.API_URL}/", {
  withCredentials: true,
  transports: ["polling"],
});

export default socket;
