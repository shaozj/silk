'use strict';

import 'shelljs/global';

const cwd = process.cwd();

export default function babelCompile(config) {
  const isProduction = process.env.NODE_ENV === 'production';
  // 默认的输入输出地址
  const srcDir = 'src/workers';
  const outDir = isProduction ? 'build' : 'public';
  const babelCmd = config.babelCmd || `babel ${srcDir} --out-dir ${outDir}`;
  cd(cwd);
  exec(babelCmd);
}
