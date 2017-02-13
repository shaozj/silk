# generator-react-webpack

[![Coverage Status](https://coveralls.io/repos/github/react-webpack-generators/generator-react-webpack/badge.svg?branch=master)](https://coveralls.io/github/react-webpack-generators/generator-react-webpack?branch=master) [![Join the chat at https://gitter.im/newtriks/generator-react-webpack](https://badges.gitter.im/newtriks/generator-react-webpack.svg)](https://gitter.im/newtriks/generator-react-webpack?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Build Status](https://secure.travis-ci.org/react-webpack-generators/generator-react-webpack.png?branch=master)](https://travis-ci.org/react-webpack-generators/generator-react-webpack) ![Amount of Downloads per month](https://img.shields.io/npm/dm/generator-react-webpack.svg "Amount of Downloads") ![Dependency Tracker](https://img.shields.io/david/react-webpack-generators/generator-react-webpack.svg "Dependency Tracker") ![Dependency Tracker](https://img.shields.io/david/dev/react-webpack-generators/generator-react-webpack.svg "Dependency Tracker") ![Node Version](https://img.shields.io/node/v/generator-react-webpack.svg "Node Version")

> Yeoman generator for [ReactJS](http://facebook.github.io/react/) - lets you quickly set up a project including karma test runner and [Webpack](http://webpack.github.io/) module system.

# About
Generator-React-Webpack will help you build new React projects using modern technologies.

Out of the box it comes with support for:

- Multipage generate
- Webpack
- ES2015 via Babel-Loader
- Different supported style languages (sass, scss, less, stylus)
- Style transformations via PostCSS
- Automatic code linting via esLint
- Ability to unit test components via Karma and Mocha/Chai


## Installation
```bash
# Make sure both is installed globally
npm install -g yo
npm install -g generator-react-multipage
```

## Setting up projects
```bash
# Create a new directory, and `cd` into it:
mkdir my-new-project && cd my-new-project

# Run the generator
yo react-multipage
```

Please make sure to edit your newly generated `package.json` file to set description, author information and the like.

## Generating new components
```bash
# After setup of course :)
# cd my-new-project
yo react-multipage:component componentName
```

## Generating new pages
```bash
# After setup of course :)
# cd my-new-project
yo react-multipage:page pageName
```

The above command will create a new component, as well as its stylesheet and a basic testcase.

## Generating new stateless functional components
```
yo react-multipage:component componentName --stateless
```

Stateless functional components where introduced in React v0.14. They have a much shorter syntax than regular ones and no state or lifecycle methods at all. Please read the [React 0.14 release notes](https://facebook.github.io/react/blog/2015/10/07/react-v0.14.html) to get more information about those components.

___Note___: You will still be able to set properties for stateless components!

## Adding PostCSS plugins
If you have enabled [PostCSS](https://github.com/postcss/postcss) at generation time, install your PostCSS plugins via npm and *require* it in **postcss** function in *cfg/base.js*.

Example for autoprefixer:

```bash
cd my-new-project
npm install autoprefixer
```
Require in *cfg/base.js*

```JavaScript
...
postcss: function () {
  return [
    require('autoprefixer')({
      browsers: ['last 2 versions', 'ie >= 8']
    })
  ];
}
...
```

## Usage
The following commands are available in your project:

```bash
# Init project first
npm run init

# Start for development
npm start # or
npm run serve

# Start the dev-server with the dist version
npm run serve:dist

# Just build the dist version and copy static files
npm run dist

# Run unit tests
npm test

# Auto-run unit tests on file changes
npm run test:watch

# Lint all files in src (also automatically done AFTER tests are run)
npm run lint

# Clean up the dist directory
npm run clean

# Just copy the static assets
npm run copy
```

### Naming Components
We have opted to follow [@floydophone](https://twitter.com/floydophone) convention of uppercase for component file naming e.g. [Component.js](https://github.com/petehunt/ReactHack/tree/master/src/components). I am open to suggestions if there is a general objection to this decision.

### Modules
Each component is a module and can be required using the [Webpack](http://webpack.github.io/) module system. [Webpack](http://webpack.github.io/) uses [Loaders](http://webpack.github.io/docs/loaders.html) which means you can also require CSS and a host of other file types. Read the [Webpack documentation](http://webpack.github.io/docs/home.html) to find out more.

## Props
Thanks to [Edd Hannay](https://github.com/eddhannay) for his Webpack optimisations, my local merge and testing meant his additions lost his signature (my fault, sorry). So, big thanks Edd.

## Contribute
Contributions are welcomed. When submitting a bugfix, write a test that exposes the bug and fails before applying your fix. Submit the test alongside the fix.

### Running Tests
`npm test` or `node node_modules/.bin/mocha`

## License
[MIT license](http://opensource.org/licenses/mit-license.php)
