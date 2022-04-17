import jwt from "jsonwebtoken";
import { config } from "../config.js";
import * as userRepository from "../data/auth.js";

const AUTH_ERROR = { message: "Authentication Error" };

//isAuth - 모든요청에 대해서 Header에 Authorization 이있는지 check
//       -if 있다면- jwt 검증된값인지 그리고 users에 있는값인지 check

export const isAuth = async (req, res, next) => {
  //   console.log("isAuth:", req.);
  const authHeader = req.get("Authorization");
  if (!(authHeader && authHeader.startsWith("Bearer "))) {
    console.log("no auth header");
    return res.status(401).json(AUTH_ERROR);
  }

  const token = authHeader.split(" ")[1];
  //TODO : Make it secure!
  console.log(token);
  jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
    if (error) {
      console.log("verify error");
      return res.status(401).json(AUTH_ERROR);
    }

    const user = await userRepository.findById(decoded.id);

    if (!user) {
      console.log("no user");
      return res.status(401).json(AUTH_ERROR);
    }
    req.userId = user.id; //req.customData
    next();
  });
};
