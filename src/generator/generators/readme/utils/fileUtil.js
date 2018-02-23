const path = require("path");
const glob = require("glob");
function bulkMoveFiles(source, destination) {
  const files = glob.sync("**", { dot: true, nodir: true, cwd: source });
  for (let i in files) {
    const dest = path.join(destination, files[i]);
    const src = path.join(source, files[i]);
    this.fs.copy(src, dest);
  }
}

module.exports = bulkMoveFiles;