//Controller
import { getSoketIO } from "../connection/socket.js";
import * as tweetRepository from "../data/tweet.js";

export async function getTweets(req, res) {
  const username = req.query.username;
  const data = await (username
    ? tweetRepository.getAllByUsername(username)
    : tweetRepository.getAll());
  res.status(200).json(data);
}
export async function getTweet(req, res, next) {
  const id = req.params.id;
  // const tweet = tweets.find((item) => item.id === id);
  const tweet = await tweetRepository.getById(id);
  if (tweet) {
    res.status(200).json(tweet);
  } else {
    // res.sendStatus(404);
    res.status(404).json({ message: `Tweet id(${id}) not found` });
  }
}

export async function createTweet(req, res, next) {
  const { text } = req.body;

  const tweet = await tweetRepository.create(text, req.userId);
  res.status(201).json(tweet);
  getSoketIO().emit("tweets", tweet);
}

export async function updateTweet(req, res, next) {
  const id = req.params.id;
  const text = req.body.text;
  // const username = req.query.username;
  console.log("updateTweet : req:", req);
  const tweet = await tweetRepository.getById(id);
  if (!tweet) {
    return res.sendStatus(404);
  }
  if (tweet.userId !== req.userId) {
    return res.sendStatus(403); // 403-로그인된 사용자이지만 특별한권한이없을때 //401- 로그인이 필요한 서비스인데 로그인이안됐을때
  }

  const updated = await tweetRepository.update(id, text);

  res.status(200).json(updated);
}

export async function deleteTweet(req, res, next) {
  const id = req.params.id;
  const tweet = await tweetRepository.getById(id);
  if (!tweet) {
    return res.sendStatus(404);
  }
  if (tweet.userId !== req.userId) {
    return res.sendStatus(403); // 403-로그인된 사용자이지만 특별한권한이없을때 //401- 로그인이 필요한 서비스인데 로그인이안됐을때
  }

  await tweetRepository.remove(id);

  res.sendStatus(204);
}
