// Model-manage data

import * as userRepository from "../data/auth.js";
import { db } from "../db/database.js";
// let tweets = [
//   {
//     id: "1",
//     text: "dream coding fighting!",
//     createdAt: new Date().toString(),
//     userId: "1",
//   },
//   {
//     id: "2",
//     text: "Hello !",
//     createdAt: new Date().toString(),
//     userId: "1",
//   },
// ];
const SELECT_JOIN =
  "SELECT tw.id,tw.text,tw.createdAt,tw.userId,us.username, us.name, us.url FROM tweets as tw JOIN users as us ON tw.userId= us.id";
const ORDER_DESC = "ORDER BY tw.createdAt DESC";
export async function getAll() {
  // return Promise.all(
  //   tweets.map(async (tweet) => {
  //     const { username, name, url } = await userRepository.findById(
  //       tweet.userId
  //     );

  //     return { ...tweet, username, name, url };
  //   })
  // );
  return db.execute(`${SELECT_JOIN} ${ORDER_DESC}`).then((result) => result[0]);
}

export async function getAllByUsername(username) {
  // return getAll().then((tweets) =>
  //   tweets.filter((tweet) => tweet.username === username)
  // );

  return db
    .execute(`${SELECT_JOIN} WHERE us.username=? ${ORDER_DESC}`, [username])
    .then((result) => result[0]);
}

export async function getById(id) {
  // const found = tweets.find((tweet) => tweet.id === id);
  // if (!found) {
  //   return null;
  // }
  // const { username, name, url } = await userRepository.findById(found.userId);

  // return { ...found, username, name, url };

  return db
    .execute(`${SELECT_JOIN} WHERE tw.id=? ${ORDER_DESC}`, [id])
    .then((result) => result[0][0]);
}

export async function create(text, userId) {
  // const tweet = {
  //   id: Date.now().toString(),
  //   text,
  //   createdAt: new Date(),
  //   userId,
  // };

  // tweets = [tweet, ...tweets];
  // return getById(tweet.id);
  return db
    .execute("INSERT INTO tweets (text,createdAt,userId) VALUES(?,?,?)", [
      text,
      new Date(),
      userId,
    ])
    .then((result) => result[0].insertId);
}

export function update(id, text) {
  // const tweet = tweets.find((tweet) => tweet.id === id);
  // if (tweet) {
  //   tweet.text = text;
  // }
  // return getById(id);
  return db
    .execute("UPDATE tweets SET text=? WHERE id=?", [text, id])
    .then(() => getById(id));
}

export function remove(id) {
  // tweets = tweets.filter((tweet) => tweet.id !== id);
  return db.execute("DELETE FROM tweets WHERE id=?", [id]);
}
