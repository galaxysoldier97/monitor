'use strict';

const spawn = require('cross-spawn');
const fs = require('fs');
const dotenv = require('dotenv');
const argv = require('minimist')(process.argv.slice(2));

function writeBrowserEnvironment() {
  const envFileValues = dotenv.config().parsed;
  const env = {};
  for (const key in envFileValues) {
    if (process.env[key]){
      env[key] = process.env[key];
    }
  }
  const basePath = fs.realpathSync(process.cwd());
  const destPath = argv.dest ? `${argv.dest}/` : '/';
  const populate = `window._env = ${JSON.stringify(env)};`;
  fs.writeFileSync(`${basePath}/${destPath}env.js`, populate);
}

writeBrowserEnvironment();

if (argv._[0]) {
  spawn(argv._[0], argv._.slice(1), {stdio: 'inherit'}).on('exit', function (
    exitCode) {
    process.exit(exitCode);
  });
}
