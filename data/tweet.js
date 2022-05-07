// Model-manage data

import Mongoose from "mongoose";
import * as userRepository from "../data/auth.js";
import { useVirtualId } from "../database/database.js";

//NO SQL - 서로 관계X  : (정보의 중복 > 관계)
// 프로필 DB
// 사용자의 문서 DB: 서버 1, 서버2 ,서버 3
// 관계형 조인쿼리의 성능이 좋지 않다.

//SQL : 관계형
//조인쿼리의 성능이 좋음

//schema
const tweetSchema = new Mongoose.Schema(
  {
    text: { type: String, required: true },
    userId: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true },
    url: String,
  },
  { timestamps: true }
);

useVirtualId(tweetSchema);
const Tweet = Mongoose.model("Tweet", tweetSchema);

export async function getAll() {
  return Tweet.find().sort({ createdAt: -1 });
}

export async function getAllByUsername(username) {
  return Tweet.find({ username }).sort({ createdAt: -1 });
}

export async function getById(id) {
  return Tweet.findById(id);
}

export async function create(text, userId) {
  return userRepository.findById(userId).then((user) =>
    new Tweet({
      text,
      userId,
      name: user.name,
      username: user.username,
      url: user.url,
    }).save()
  );
}

export function update(id, text) {
  return Tweet.findByIdAndUpdate(id, { text }, { returnOriginal: false });
}

export function remove(id) {
  return Tweet.findByIdAndDelete(id);
}
