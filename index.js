"use strict";

const mkdirp = require("mkdirp");
const path = require("path");
const fs = require("fs");
const Babel = require("babel-standalone");
const babelrc = require("./package").babel;

const utils = require("./utils");
const getTweet = require("./sources/twitter").getTweet;
const searchTweets = require("./sources/twitter").searchTweets;

const rootPath = utils.getTopLevelDirectory();
const packageLoc = path.join(rootPath, "package.json");

let pkg;
let twpmModulesName = "node_modules";
let twpmFolderPrefix = "twpm-";
try {
  pkg = require(packageLoc);
  twpmModulesName = pkg && pkg.twpm && pkg.twpm.modulesLocation || twpmModulesName;
  twpmFolderPrefix = pkg && pkg.twpm && pkg.twpm.folderPrefix || twpmFolderPrefix;
} catch(e) {
  throw new Error(`${e.message}\nProbably a missing package.json`);
}

const twpmFolder = path.join(rootPath, twpmModulesName);

function twpmPath(moduleName) {
  return `${twpmFolder}/${moduleName}`;
}

function matchTwitterUrl(path) {
  const tweetRegex = /^https?:\/\/twitter\.com\/(?:#!\/)?(?:\w+)\/status(?:es)?\/(\d+)$/;
  return tweetRegex.exec(path);
}

function install(path, name) {
  if (!path && pkg && pkg.twpm) {
    for (let dep in pkg.twpm.dependencies) {
      if (dep.startsWith(twpmFolderPrefix)) {
        install(pkg.twpm.dependencies[dep], dep);
      }
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
    _install(name || match, data);
  }, (err) => {
    throw new Error(err);
  });
}

function _install(moduleName, data) {
  const folder = twpmPath(`${
    moduleName.startsWith(twpmFolderPrefix) ?
    moduleName :
    twpmFolderPrefix + moduleName
  }`);

  mkdirp(folder, function (err) {
    if (err) {
      console.error(err, `Unable to create folder ${folder}`);
    }

    let splitNewLines = data.text.split("\n");
    if (splitNewLines.length > 0) {
      if (splitNewLines[0].indexOf("#twpm") >= 0) {
        data.text = splitNewLines[1];
      }
    }

    var transformedText;
    try {
      transformedText = Babel.transform(data.text, babelrc).code;
    } catch (e) {
      throw new Error(`Error with transforming tweet ${e}`);
    }

    transformedText += "\n module.exports = exports['default'];"

    fs.writeFile(path.join(folder, 'index.js'), transformedText, (err) => {
      if (err) console.error(err, `Unable to write ${folder} text to index.js`);
    });

    fs.writeFile(path.join(folder, 'package.json'), JSON.stringify(data, null, "  "), (err) => {
      if (err) console.error(err, `Unable to write ${folder}'s package.json`);
    });
  });
}

function search(query) {
  searchTweets(query);
}

module.exports = {
  install,
  search
};
