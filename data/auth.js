//MODEL

import { getUsers } from "../database/database.js";
import MongoDb from "mongodb";

const ObjectId = MongoDb.ObjectId;

export async function findByUsername(username) {
  return getUsers().findOne({ username }).then(mapOptionalUser);
}

export async function findById(id) {
  return getUsers()
    .findOne({ _id: new ObjectId(id) })
    .then((data) => {
      return mapOptionalUser(data);
    });
}

export async function createUser(user) {
  return getUsers()
    .insertOne(user)
    .then((data) => data.insertedId.toString());
}

// return user's new object if user exist
// if not return null
function mapOptionalUser(user) {
  return user ? { ...user, id: user._id.toString() } : null;
}
