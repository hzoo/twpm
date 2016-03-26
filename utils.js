var child = require("child_process");

function execSync(cmd) {
  return child.execSync(cmd, {
    encoding: "utf8"
  }).trim();
};

function getTopLevelDirectory() {
  return execSync("git rev-parse --show-toplevel");
});

module.exports = {
  getTopLevelDirectory: getTopLevelDirectory
}
