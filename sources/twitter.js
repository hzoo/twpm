"use strict";

const path = require("path");
const Twit = require("twit");
const decode = require("entities").decodeHTML;
const utils = require("../utils");
const rootPath = utils.getTopLevelDirectory();
const configLoc = path.join(rootPath, "twitter-config");

let twit;
try {
 twit = new Twit(require(configLoc));
} catch(e) {
  throw new Error(`${e.message}\nProbably a missing ./twitter-config.js file. Check the twpm readme`);
}

const packageLoc = path.join(rootPath, "package.json");

let pkg;
try {
  pkg = require(packageLoc);
} catch(e) {}

module.exports = function getTweet(id, name) {
  return twit.get(`/statuses/show/:id`, { id })
  .then((tweet) => {
    const data = tweet.data;
    if (data.errors) {
      throw new Error(`${data.errors[0].code}: ${data.errors[0].message}`);
    }
    data.text = decode(data.text);

    if (name) {
      console.log(name);
    }
    console.log(`Tweet ${id}: ${data.retweet_count} Retweets`);
    console.log(`@${data.user.screen_name} at ${data.created_at}`);
    console.log("===");
    console.log(data.text);
    console.log("---");
    console.log();

    const filter = pkg.twpm && pkg.twpm.fields && pkg.twpm.fields.concat("text") || [
      "created_at",
      "text",
      "id_str",
      "user",
      "screen_name"
    ];

    return JSON.stringify(data, filter, 4);
  }, (err) => {
    return err;
  });
}
