'use strict';

import babel from 'babel-core';
import getPaths from './utils/paths';
import { resolve } from 'path';
import fs from 'fs';
import 'shelljs/global';

const cwd = process.cwd();
const paths = getPaths(cwd);

export default function babelCompile(config) {
  const isProduction = process.env.NODE_ENV === 'production';
  console.log('NODE_ENV', process.env.NODE_ENV);
  // const outputPath = argv.outputPath || config.outputPath || 'build';
  // let outDir = paths.resolveApp(outputPath);
  // 默认的输入输出地址
  const srcDir = 'src/workers';
  const outDir = isProduction ? 'build' : 'public';
  const babelCmd = config.babelCmd || `babel ${srcDir} --out-dir ${outDir}`;
  cd(cwd);
  exec(babelCmd);
}
