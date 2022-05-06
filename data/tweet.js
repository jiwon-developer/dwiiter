// Model-manage data

import * as userRepository from "../data/auth.js";
import { getTweets, getUsers } from "../database/database.js";
import MongoDb from "mongodb";

//NO SQL - 서로 관계X  : (정보의 중복 > 관계)
// 프로필 DB
// 사용자의 문서 DB: 서버 1, 서버2 ,서버 3
// 관계형 조인쿼리의 성능이 좋지 않다.

//SQL : 관계형
//조인쿼리의 성능이 좋음

const ObjectId = MongoDb.ObjectId;
export async function getAll() {
  return getTweets().find({}).sort({ createdAt: -1 }).toArray().then(mapTweets);
}

export async function getAllByUsername(username) {
  return getTweets()
    .find({ username })
    .sort({ createdAt: -1 })
    .toArray()
    .then(mapTweets);
}

export async function getById(id) {
  return getTweets()
    .findOne({ _id: new ObjectId(id) })
    .then((data) => {
      const tweets = mapOptionalTweet(data);
      return tweets;
    });
}

export async function create(text, userId) {
  const { name, username, url } = await userRepository.findById(userId);

  const tweet = {
    text,
    createdAt: new Date(),
    userId,
    name: name,
    username: username,
    url: url,
  };

  return getTweets()
    .insertOne(tweet)
    .then((data) => {
      const newTweet = mapOptionalTweet({ ...tweet, _id: data.insertedId });
      console.log(newTweet);
      return newTweet;
    });
}

export function update(id, text) {
  const filter = { _id: new ObjectId(id) };

  // create a document that sets the plot of the movie
  const updateDoc = { $set: { text } };
  const option = { returnDocument: "after" }; // return updated data / Default : before
  return getTweets()
    .findOneAndUpdate(filter, updateDoc, option)
    .then((result) => mapOptionalTweet({ ...result.value }));
}

export function remove(id) {
  // tweets = tweets.filter((tweet) => tweet.id !== id);

  return getTweets().deleteOne({ _id: new ObjectId(id) });
  // .then((result) => {
  //   if (result.deletedCount === 1) {
  //     console.log("Successfully deleted one document.");
  //   } else {
  //     console.log("No documents matched the query. Deleted 0 documents.");
  //   }
  // });
}

function mapOptionalTweet(tweet) {
  return tweet ? { ...tweet, id: tweet._id.toString() } : tweet;
}
/// param: tweet array to create id properties
function mapTweets(tweets) {
  return tweets.map(mapOptionalTweet);
}
