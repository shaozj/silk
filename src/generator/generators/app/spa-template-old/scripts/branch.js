const shell = require('shelljs');
const git = require('simple-git');
const path = require('path');
const dir = path.join(__dirname, '../');

git(dir).branch((err, res) => {
  console.log('current branch: ', res.current);  // eslint-disable-line
  let newVersion = process.argv[2];
  if (newVersion) {
    var nextBranch = 'daily/' + newVersion;
  } else {
    const version = res.current.split('/')[1];
    const vArr = version.split('.');
    vArr[2] ++;
    var nextBranch = 'daily/' + vArr.join('.');
  }
  shell.exec(`git checkout master && git pull && git branch ${nextBranch} && git checkout ${nextBranch} && git push origin ${nextBranch}`);
});
