//MODEL
import SQ from "sequelize";
import { db, sequelize } from "../db/database.js";

const DataTypes = SQ.DataTypes;

//create user table and define schema
const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    url: DataTypes.TEXT,
  },
  { timestamps: false }
);

export async function findByUsername(username) {
  return User.findOne({ where: { username: username } });

  // return db
  //   .execute("SELECT * FROM users WHERE username =?", [username])
  //   .then((result) => result[0][0]);
}

export async function findById(id) {
  return User.findByPk(id);
  // return db
  //   .execute("SELECT * FROM users WHERE id =?", [id])
  //   .then((result) => result[0][0]);
}

export async function createUser(user) {
  const { username, password, name, email, url } = user;

  return User.create(user).then((data) => {
    console.log(data);
    return data.dataValues.id;
  });

  // return db
  //   .execute(
  //     "INSERT INTO users (username,password,name,email,url) VALUES(?,?,?,?,?)",
  //     [username, password, name, email, url]
  //   )
  //   .then((result) => result[0].insertId);
}
