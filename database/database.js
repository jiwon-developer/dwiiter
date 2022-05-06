import Mongoose from "mongoose";
import { config } from "../config.js";

//promise return
export async function connectDB() {
  return Mongoose.connect(config.db.host);
}

export function useVirtualId(schema) {
  //_id -> id :  ObjectId(id).toString()
  schema.virtual("id").get(function () {
    return this._id.toString();
  });

  // json으로 변환시 가상의 요소도 포함시키기
  schema.set("toJSON", { virtuals: true });
  schema.set("toObject", { virtuals: true });
}

//TODO (Jiwon) : Delete below
let db;

export function getUsers() {
  return db.collection("users");
}

export function getTweets() {
  return db.collection("tweets");
}
