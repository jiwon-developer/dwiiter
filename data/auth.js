//MODEL

//Test Data
// let users = [
//   {
//     id: "1",
//     username: "bob",
//     password: "$2b$12$D.m4J1MjtjIK6M9llKDsWu0152yKsBskT8dNPyQSUZZvbiQIz1svq", //abcd1234
//     name: "Bob",
//     email: "bob@gmail.com",
//     url: "https://cdn.expcloud.co/life/uploads/2020/04/27135731/Fee-gentry-hed-shot-1.jpg",
//   },
//   {
//     id: "2",
//     username: "james",
//     password: "$2b$15$Loxte0N.O7/6w.U9guk/AOgksyJ.nk0bSxybmXcio5PIINR8SUedW", //abcd1234
//     name: "James",
//     email: "james@gmail.com",
//   },
// ];

import { db } from "../db/database.js";

export async function findByUsername(username) {
  // return users.find((user) => user.username === username);
  return db
    .execute("SELECT * FROM users WHERE username =?", [username])
    .then((result) => result[0][0]);
}

export async function findById(id) {
  // console.log(users, id);
  // return users.find((user) => user.id === id);
  return db
    .execute("SELECT * FROM users WHERE id =?", [id])
    .then((result) => result[0][0]);
}

export async function createUser(user) {
  // const created = {
  //   ...user,
  //   id: Date.now().toString(),
  // };
  // users.push(created);
  // return created.id;

  const { username, password, name, email, url } = user;
  return db
    .execute(
      "INSERT INTO users (username,password,name,email,url) VALUES(?,?,?,?,?)",
      [username, password, name, email, url]
    )
    .then((result) => result[0].insertId);
}
