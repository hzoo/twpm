"use strict";

const path = require("path");
const fs = require("fs");
const utils = require("./utils");
const getTweet = require("./sources/twitter.js");

const rootPath = utils.getTopLevelDirectory();
const packageLoc = path.join(rootPath, "package.json");

let pkg;
let twpmModulesName = "tweet_modules";
try {
  pkg = require(packageLoc);
  twpmModulesName = pkg && pkg.twpm && pkg.twpm.modulesLocation || twpmModulesName;
} catch(e) {
  throw new Error(`${e.message}\nProbably a missing package.json`);
}

const twpmFolder = path.join(rootPath, twpmModulesName);

function twpmPath(moduleName) {
  return `${twpmFolder}/${moduleName}.js`;
}

function matchTwitterUrl(path) {
  const tweetRegex = /^https?:\/\/twitter\.com\/(?:#!\/)?(?:\w+)\/status(?:es)?\/(\d+)$/;
  return tweetRegex.exec(path);
}

function install(path, name) {
  if (!path && pkg && pkg.twpmDependencies) {
    for (let dep in pkg.twpmDependencies) {
      install(pkg.twpmDependencies[dep], dep);
    }
    return;
  }

  let match = matchTwitterUrl(path);
  if (match) {
    match = match[1];
  } else {
    match = path;
  }

  if (!match) {
    return;
  }

  getTweet(match, name)
  .then((data) => {
    _install(`twitter:${match}`, data);
  }, (err) => {
    console.error(err.message);
  });
}

function _install(moduleName, data) {
  fs.stat(twpmFolder, (e) => {
    if (e && e.code === "ENOENT") {
      fs.mkdirSync(twpmFolder);
    }

    fs.writeFile(twpmPath(moduleName), data, "utf8", (err) => {
      if (err) {
        console.error(`Unable to install file at ${twpmPath(moduleName)}`);
        throw err;
      }
    });
  });
}

module.exports = {
  install: install
};
