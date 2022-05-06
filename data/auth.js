//MODEL

import Mongoose from "mongoose";
import { useVirtualId } from "../database/database.js";

//const ObjectId = MongoDb.ObjectId;

//schema
const userSchema = new Mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  url: String,
});

useVirtualId(userSchema);
//Create model and link  User collection to userSchema
const User = Mongoose.model("User", userSchema);

export async function findByUsername(username) {
  // return getUsers()
  //   .findOne({ username })
  //   .next()
  //   .then(mapOptionalUser);
  return User.findOne({ username });
}

export async function findById(id) {
  return User.findById(id);
  // return getUsers()
  //   .findOne({ _id: new ObjectId(id) })
  //   .next()
  //   .then((data) => {
  //     return mapOptionalUser(data);
  //   });
}

export async function createUser(user) {
  return new User(user).save().then((data) => data.id);
  // return getUsers()
  //   .insertOne(user)
  //   .then((data) => data.insertedId.toString());
}

// return user's new object if user exist
// if not return null
// function mapOptionalUser(user) {
//   return user ? { ...user, id: user._id.toString() } : null;
// }
