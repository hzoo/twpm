"use strict";

const path = require("path");
const fs = require("fs");
const utils = require("./utils");
const getTweet = require("./sources/twitter.js");

const rootPath = utils.getTopLevelDirectory();
const packageLoc = path.join(rootPath, "package.json");

let pkg;
let lppmModulesName = "tweet_modules";
try {
  pkg = require(packageLoc);
  lppmModulesName = pkg && pkg.lppm && pkg.lppm.modulesLocation || lppmModulesName;
} catch(e) {
  throw new Error(`${e.message}\nProbably a missing package.json`);
}

const lppmFolder = path.join(rootPath, lppmModulesName);

function lppmPath(moduleName) {
  return `${lppmFolder}/${moduleName}.js`;
}

function matchTwitterUrl(path) {
  const tweetRegex = /^https?:\/\/twitter\.com\/(?:#!\/)?(?:\w+)\/status(?:es)?\/(\d+)$/;
  return tweetRegex.exec(path);
}

function install(path, name) {
  if (!path && pkg && pkg.lppmDependencies) {
    for (let lp in pkg.lppmDependencies) {
      install(pkg.lppmDependencies[lp], lp);
    }
    return;
  }

  let match = matchTwitterUrl(path);
  if (match) {
    match = match[1];
  } else {
    match = path;
  }

  getTweet(match, name)
  .then((data) => {
    _install(`twitter:${match}`, data);
  }, (err) => {
    console.error(err.message);
  });
}

function _install(moduleName, data) {
  fs.stat(lppmFolder, (e) => {
    if (e && e.code === "ENOENT") {
      fs.mkdirSync(lppmFolder);
    }

    fs.writeFile(lppmPath(moduleName), data, "utf8", (err) => {
      if (err) {
        console.error(`Unable to install file at ${lppmPath(moduleName)}`);
        throw err;
      }
    });
  });
}

module.exports = {
  install: install
};
