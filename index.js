const utils = require("./utils");
const rootPath = utils.getTopLevelDirectory();
const packageLoc = path.join(rootPath, "package.json");

const pkg = require(packageLoc);
const lppmrc = pkg.lppm;
const lppmModulesName = lppm && lppm.modulesLocation || "tweet_modules";
const lppmFolder = path.join(rootPath, lppmModulesName);

function lppmPath(id) {
  return `${lppmFolder}/${id}.js`;
}

function install(id, data) {
  fs.stat(lppmFolder, (e) => {
    if (e && e.code === "ENOENT") {
      fs.mkdirSync(lppmFolder);
    }

    fs.writeFile(lppmPath(id), data, "utf8", (err) => {
      if (err) {
        console.error(`Unable to install file at ${lppmPath(id)}`);
        throw err;
      }
    });
  });
}

module.exports = {
  install: install
};
