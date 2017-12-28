#!/usr/bin/env node

const ora = require('ora');
const path = require('path');
const fs = require('fs-extra');
const core = require('../src/core');
const optimist = require('optimist')
  .usage('\nUsage: discogs-wantlist --user yourusername')
  .alias('user', 'u')
  .alias('help', 'h')
  .alias('version', 'v')
  .describe('user', 'discogs username')
  .describe('help', 'print help')
  .describe('version', 'print version');
const argv = optimist.argv;

if (argv.help || argv.h) {
  optimist.help();
  optimist.showHelp();
  return;
}

if (argv.version || argv.v) {
  const version = fs.readJSONSync(path.join(__dirname, '../package.json')).version;

  console.info(version);
  return;
}

const username = argv.user || argv.u;

if (username) {
  const spinner = ora({color: 'yellow'});

  spinner.start('Extracting wantlist!');

  core
    .extractWantlist(username)
    .then(wantlist => {
      spinner.succeed(`${username}'s wantlist was extracted!`);
      console.log(`\n${wantlist}\n`);
    })
    .catch(err => {
      spinner.fail('Extracting wantlist failed because of the error 👇');
      console.error(err);
    });
}
