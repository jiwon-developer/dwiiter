// Model-manage data

// import { db } from "../db/database.js";
import SQ from "sequelize";
import { sequelize } from "../db/database.js";
import { User } from "./auth.js";
const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;

const Tweet = sequelize.define("tweet", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});
//create foreign key
Tweet.belongsTo(User);

// const SELECT_JOIN =
//   "SELECT tw.id,tw.text,tw.createdAt,tw.userId,us.username, us.name, us.url FROM tweets as tw JOIN users as us ON tw.userId= us.id";
// const ORDER_DESC = "ORDER BY tw.createdAt DESC";

const INCLUDE_USER = {
  attributes: [
    "id",
    "text",
    "createdAt",
    "userId",
    [Sequelize.col("user.name"), "name"],
    [Sequelize.col("user.username"), "username"],
    [Sequelize.col("user.url"), "url"],
  ],
  include: {
    model: User,
    attributes: [],
  },
};

const ORDER_DESC = { order: [["createdAt", "DESC"]] };

export async function getAll() {
  return Tweet.findAll({ ...INCLUDE_USER, ...ORDER_DESC });
  // return db.execute(`${SELECT_JOIN} ${ORDER_DESC}`).then((result) => result[0]);
}

export async function getAllByUsername(username) {
  return Tweet.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    include: {
      ...INCLUDE_USER.include,
      where: { username },
    },
  });

  // return db
  //   .execute(`${SELECT_JOIN} WHERE us.username=? ${ORDER_DESC}`, [username])
  //   .then((result) => result[0]);
}

export async function getById(id) {
  return Tweet.findOne({
    where: { id },
    ...INCLUDE_USER,
  });

  // return db
  //   .execute(`${SELECT_JOIN} WHERE tw.id=? ${ORDER_DESC}`, [id])
  //   .then((result) => result[0][0]);
}

export async function create(text, userId) {
  return Tweet.create({ text, userId }).then((data) =>
    this.getById(data.dataValues.id)
  );

  // return db
  //   .execute("INSERT INTO tweets (text,createdAt,userId) VALUES(?,?,?)", [
  //     text,
  //     new Date(),
  //     userId,
  //   ])
  //   .then((result) => result[0].insertId);
}

export function update(id, text) {
  return Tweet.findByPk(id, INCLUDE_USER).then((tweet) => {
    tweet.text = text;
    return tweet.save();
  });

  // return db
  //   .execute("UPDATE tweets SET text=? WHERE id=?", [text, id])
  //   .then(() => getById(id));
}

export function remove(id) {
  return Tweet.findByPk(id).then((tweet) => {
    tweet.destroy();
  });
  //  return db.execute("DELETE FROM tweets WHERE id=?", [id]);
}
