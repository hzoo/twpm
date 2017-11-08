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
  twpm.install(url, args[3]);

  // npm install id-here --save name-here
  const extra = args[2];
  if (extra === "--save" || extra === "-S") {

    const utils = require("../utils");
    const path = require("path");
    const fs = require("fs");
    const rootPath = utils.getTopLevelDirectory();
    const packageLoc = path.join(rootPath, "package.json");
    const pkg = require(packageLoc);

    const prefix = pkg.twpm && pkg.twpm.folderPrefix || "@twpm/";

    if (!pkg.twpm) {
      pkg.twpm = {};
    }
    if (!pkg.twpm.dependencies) {
      pkg.twpm.dependencies = {};
    }
    const pkgName = `${prefix}${args[3] || url}`;

    pkg.twpm.dependencies[pkgName] = url;

    fs.writeFileSync(packageLoc, JSON.stringify(pkg, null, "  "));

    console.log(`${pkgName}@0.0.0 ${process.cwd()}`);
    console.log();
  }
} else if (arg === "search" || arg === "list") {
  console.log("Use the id (number) of the tweet results to install");
  console.log("twpm i id-here --save-dev name-here");
  console.log();

  const twpm = require("../index");
  const pkg = args[1];
  twpm.search(pkg);
} else {
  if (arg) {
    console.error(`Unknown command ${JSON.stringify(arg)}`);
  } else {
    console.log("Try `twpm install https://twitter.com/rauchg/status/712799807073419264`");
  }
  process.exit(1);
}
