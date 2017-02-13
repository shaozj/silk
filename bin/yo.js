const path = require('path');
const fs = require('fs');

function resolveName(name) {
  return name.replace(/^(generator-)?(.+)$/, 'generator-$2');
}

module.exports = function yo(name, args, cb) {
  var cy = this;
  var type = name.split(':')[0];
  var sub = name.split(':')[1] || 'app';
  var genName = resolveName(type);

  //var generatorRoot = path.resolve(__dirname, '../node_modules', genName);
  var generatorRoot = path.resolve(__dirname, '../src/generator');

  var resolved = path.join(generatorRoot, sub, 'index.js');

  if (!fs.existsSync(resolved)) {
    resolved = path.join(generatorRoot, 'generators', sub, 'index.js');
  }

  try {
    if (!fs.existsSync(resolved)) {
      throw new Error('can not find generator: %s', sub);
    }
  } catch (e) {
    console.log('can not find generator: %s', sub);
    process.exit(1);
  }

  var Generator = require(resolved);

  var generator = new Generator(args || [], {
    resolved: resolved,
    env: {
      cwd: process.cwd()
    },
    name: name
  });

  generator.run(cb);
};
