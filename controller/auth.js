//Controller
import jwt from "jsonwebtoken";
import * as userRepository from "../data/auth.js";
import bcrypt from "bcrypt";
import { config } from "../config.js";

// const jwtSecretKey = //"0r@pp1SKQSiAh*cNuChpGJXG%b*5$Ubh"; // 보안 issue
// const jwtExpiresInDays = "2d";
// const bcryptSaltRound = 12;

const createJwtToken = (id) => {
  //console.log(config.jwt.secretKey);
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
};

export async function signup(req, res, next) {
  const { username, password, name, email, url } = req.body;
  const found = await userRepository.findByUsername(username);
  if (found) {
    return res.status(409).json({ message: `${username} already exists` });
  }
  const hashed = await bcrypt.hashSync(password, config.bcrypt.saltRounds);

  //사용자의 고유한 id생성됨
  const userId = await userRepository.createUser({
    username,
    password: hashed,
    name,
    email,
    url,
  });

  const token = createJwtToken(userId);

  res.status(201).json({ token, username });
}

export async function login(req, res, next) {
  const { username, password } = req.body;
  const user = await userRepository.findByUsername(username);
  console.log(user);

  if (!user) {
    return res.status(401).json({ message: "Invalid user or password" });
  }
  const isValidPassword = await bcrypt.compare(password, user.password); //db에 저장된 hashed passwor 와 사용자가 입력한 password가 같은지 check

  if (!isValidPassword) {
    console.log("not valid passwordd");
    return res.status(401).json({ message: "Invalid user or passord" });
  }
  const token = createJwtToken(user.id);

  res.status(202).json({ token, username });
}

export async function me(req, res, next) {
  // console.log("req:", req);
  const user = await userRepository.findById(req.userId);

  if (!user) {
    return res.status(404).json({ message: "user not found!" });
  }

  res.status(200).json({ token: req.token, username: user.username });
}
