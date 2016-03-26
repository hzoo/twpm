"use strict";

var child = require("child_process");

function getTopLevelDirectory() {
  let dir;
  try {
    dir = child.execSync("git rev-parse --show-toplevel", {
      encoding: "utf8",
      stdio: "ignore"
    }).trim();
  } catch(e) {
    dir = process.cwd();
  }

  return dir;
};

module.exports = {
  getTopLevelDirectory: getTopLevelDirectory
};
