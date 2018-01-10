const shell = require('shelljs');
const git = require('simple-git');
const path = require('path');
const dir = path.join(__dirname, '../');

git(dir).branch((err, res) => {
  console.log('current branch: ', res.current);
  const nextTag = res.current.replace('daily', 'publish');
  shell.exec(`git tag ${nextTag} && git push origin ${nextTag}`);
});
