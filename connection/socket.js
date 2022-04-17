import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

class Socket {
  constructor(server) {
    //1.Make soket server
    this.io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    this.io.use((socket, next) => {
      //token검증
      const token = socket.handshake.auth.token;
      if (!token) {
        // token이없는경우
        return next(new Error("Authentication error"));
      }
      jwt.verify(token, config.jwt.secretKey, (error, decoded) => {
        if (error) {
          //jwt로 해독이 불가능한경우 즉 올 바른 토근이 아니라면
          return next(new Error("Authentication error"));
        }
        next();
      });
    });

    this.io.on("connection", (socket) => {
      console.log("Socket client connected");
    });
  }
}

let socket;
export function initSocket(server) {
  if (!socket) {
    socket = new Socket(server);
  }
}

export function getSoketIO() {
  if (!socket) {
    throw new Error("Please call init first");
  }
  return socket.io;
}
