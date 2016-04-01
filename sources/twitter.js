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

function getTweet(id, name) {
  return twit.get(`/statuses/show/:id`, { id })
  .then((tweet) => {
    const data = tweet.data;
    if (data.errors) {
      throw new Error(`${data.errors[0].code}: ${data.errors[0].message}`);
    }
    data.text = decode(data.text);

    var filteredData = {};
    if (name) {
      const prefix = pkg.twpm && pkg.twpm.folderPrefix || "twpm-";

      filteredData.name = name;
      if (!name.startsWith(prefix)) {
        filteredData.name = `${prefix}${name}`;
      }
    } else {
      filteredData.name = `${prefix}${id}`;
    }

    console.log(`Tweet ${id}: ${data.retweet_count} 🔄, ${data.favorite_count} 💟`);
    console.log(`@${data.user.screen_name} at ${data.created_at}`);
    console.log("===");
    console.log(data.text);
    console.log("---");
    console.log();

    const filter = pkg.twpm &&
    pkg.twpm.packageMetadata &&
    pkg.twpm.packageMetadata.concat(["name", "text", "screen_name", "id_str"]) || [
      "name",
      "text",
      "screen_name",
      "id_str",
      "retweet_count",
      "favorite_count",
      "created_at",
      "user"
    ];

    filteredData.version = "0.0.0";

    for (let i in data) {
      if (filter.indexOf(i) >= 0) {
        if (i === "user") {
          filteredData.user = {
            name: data.user.name,
            screen_name: data.user.screen_name
          }
        } else {
          filteredData[i] = data[i];
        }
      }
    }

    return filteredData;
  }, (err) => {
    return err;
  });
}

function searchTweets(query) {
  return twit.get(`/search/tweets`, {
    q: `#twpm since:2016-04-01 ${query ? query: ""}`,
    count: 10
  })
  .then((tweet) => {
    let tweets = tweet.data.statuses;
    if (!tweets.length) {
      console.log("Nothing found for query");
      return;
    }

    for (let i = 0; i < tweets.length; i++) {
      let data = tweets[i];

      data.text = decode(data.text);

      console.log(`Tweet ${data.id}: ${data.retweet_count} 🔄, ${data.favorite_count} 💟`);
      console.log(`@${data.user.screen_name} at ${data.created_at}`);
      console.log("===");
      console.log(data.text);
      console.log("---");
      console.log();
    }
  }, (err) => {
    console.log(err);
  });
}

module.exports = {
  getTweet,
  searchTweets
}
