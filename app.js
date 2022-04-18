import express from "express";
import cors from "cors";
import morgan from "morgan"; // for debugging
import helmet from "helmet"; // for security
import tweetsRoute from "./router/tweets.js";
import authRoute from "./router/auth.js";
import "express-async-error";
import { config } from "./config.js";
import { initSocket } from "./connection/socket.js";
import { sequelize } from "./db/database.js";

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

//connection  to sequelize
sequelize.sync().then((client) => {
  console.log(client);
});

//socketIo
const server = app.listen(config.host.port);
initSocket(server);
