import express from "express";
import "express-async-error";
import { body } from "express-validator";

import * as tweetController from "../controller/tweet.js";
import { isAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validator.js";

//validation
//sanitization
//Contract Testing: Client-server
//Proto-

const router = express.Router();

const validateTweet = [
  body("text")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Text should be at least 3 characters!"),
  validate,
];
//GET/Tweets

//isAuth middleware-> 로그인한사람만가능하게 해줌
router.get("/", isAuth, tweetController.getTweets);

//GET/Tweets/:id
router.get("/:id", isAuth, tweetController.getTweet);

//POST /Tweets

router.post("/", isAuth, validateTweet, tweetController.createTweet);

//PUT /Tweets/:id
router.put("/:id", isAuth, validateTweet, tweetController.updateTweet);

//DELETE

router.delete("/:id", isAuth, tweetController.deleteTweet);

export default router;
