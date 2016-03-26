#!/usr/bin/env node

const args = process.argv.slice(2);
if (args.length > 2) {
  console.error("Too many arguments.");
  process.exit(1);
}

const arg = args[0];

if (arg === "-v" || arg === "-V" || arg === "--version" || arg === "-version") {
  console.log(require("../package.json").version);
  process.exit(0);
}

const lppm = require("../index");
const tweetRegex = /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)$/;
const getTweetId = (str) => tweetRegex.exec(str);

if (arg === "install" || arg === "i") {
  const url = args[1];
  const extra = args[2];

  let match = getTweetId(url);
  if (match) {
    lppm.install(match[1]);
  }

} else {
  console.error("Unknown command " + JSON.stringify(arg));
  process.exit(1);
}
