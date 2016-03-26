#!/usr/bin/env node
"use strict";

const args = process.argv.slice(2);
if (args.length > 4) {
  console.error("Too many arguments.");
  process.exit(1);
}

const arg = args[0];

if (arg === "-v" || arg === "-V" || arg === "--version" || arg === "-version") {
  console.log(require("../package.json").version);
  process.exit(0);
}


if (arg === "install" || arg === "i") {
  const twpm = require("../index");

  const url = args[1];
  twpm.install(url);

  // npm install id-here --save name-here
  const extra = args[2];
  if (extra === "--save") {
    const utils = require("../utils");
    const path = require("path");
    const fs = require("fs");
    const rootPath = utils.getTopLevelDirectory();
    const packageLoc = path.join(rootPath, "package.json");
    const pkg = require(packageLoc);

    if (!pkg.twpmDependencies) {
      pkg.twpmDependencies = {};
    }

    pkg.twpmDependencies[args[3] || url] = url;

    fs.writeFileSync(packageLoc, JSON.stringify(pkg, null, "  "));
  }
} else {
  if (arg) {
    console.error(`Unknown command ${JSON.stringify(arg)}`);
  } else {
    console.log("Try `twpm install https://twitter.com/rauchg/status/712799807073419264`");
  }
  process.exit(1);
}
