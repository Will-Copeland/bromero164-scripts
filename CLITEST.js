#!/usr/bin/env node

const chalk = require('chalk');
const figlet = require('figlet');


console.log(
  chalk.green(
    figlet.textSync('Brando', { horizontalLayout: 'full' }),
  ),
);

console.log(chalk.bgBlue('Willi'));
