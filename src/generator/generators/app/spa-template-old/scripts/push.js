const shell = require('shelljs');
const git = require('simple-git');
const path = require('path');
const dir = path.join(__dirname, '../');

git(dir).branch((err, res) => {
  console.log('current branch: ', res.current);
  const curBranch = res.current;
  const commit = process.argv[2] || 'up';
  shell.exec(`git add . && git commit -m "${commit}" && git push origin ${curBranch}`);
});
