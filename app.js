import express from "express";
import cors from "cors";
import morgan from "morgan"; // for debugging
import helmet from "helmet"; // for security
import tweetsRoute from "./router/tweets.js";
import authRoute from "./router/auth.js";
import "express-async-error";
import { config } from "./config.js";
import { initSocket } from "./connection/socket.js";
import { db } from "./db/database.js";

const app = express();

//middleware setting
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));

app.use("/tweets", tweetsRoute);
app.use("/auth", authRoute);

//공통에러 처리
app.use((req, res, next) => {
  res.sendStatus(404);
});
app.use((error, req, res, next) => {
  console.error(error);
  res.sendStatus(500);
});

// DB connection => model에서 처리만해주면 끝
db.getConnection().then((connection) => console.log("db connected"));

//socketIo
const server = app.listen(config.host.port);
initSocket(server);

// const socketIO = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

// socketIO.on("connection", (socket) => {
//   console.log("Client is here!");
// });

// setInterval(() => {
//   socketIO.emit("dwitter", "hello!");
// }, 1000);
