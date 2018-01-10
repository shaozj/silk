const shell = require('shelljs');
const git = require('simple-git');
const path = require('path');
const dir = path.join(__dirname, '../');

git(dir).branch((err, res) => {
  console.log('current branch: ', res.current);
  shell.exec('npm run build && git add . && git commit -m "build" && git push origin ' + res.current);
});
