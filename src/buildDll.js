import chalk from 'chalk';
import webpack from 'webpack';
import getPaths from './utils/paths';
import getConfig from './utils/getConfig';
import applyWebpackConfig, { warnIfExists } from './utils/applyWebpackConfig';

let rcConfig;
let config;
const argv = require('yargs')
  .usage('Usage: roadhog build [options]')
  .option('debug', {
    type: 'boolean',
    describe: 'Build without compress',
    default: false,
  })
  .help('h')
  .argv;

export function build(argv) {
  const paths = getPaths(argv.cwd);

  try {
    rcConfig = getConfig(process.env.NODE_ENV, argv.cwd);
  } catch (e) {
    console.log(chalk.red('Failed to parse .silkrc config.'));
    console.log();
    console.log(e.message);
    process.exit(1);
  }

  config = applyWebpackConfig(
    require('./config/webpack.config.dll')(argv, rcConfig, paths),
    process.env.NODE_ENV,
  );

  realBuild(argv);
}


// Print out errors
function printErrors(summary, errors) {
  console.log(chalk.red(summary));
  console.log();
  errors.forEach((err) => {
    console.log(err.message || err);
    console.log();
  });
}

function doneHandler(argv, err, stats) {
  if (err) {
    printErrors('Failed to compile.', [err]);
    process.exit(1);
  }

  if (stats.compilation.errors.length) {
    printErrors('Failed to compile.', stats.compilation.errors);
    process.exit(1);
  }

  warnIfExists();

  console.log(chalk.green('Compiled successfully.'));
  console.log();
}

// Create the production build and print the deployment instructions.
function realBuild(argv) {
  const compiler = webpack(config);
  const done = doneHandler.bind(null, argv);
  compiler.run(done);
}

// Run.
if (require.main === module) {
  build({ ...argv, cwd: process.cwd() });
}
