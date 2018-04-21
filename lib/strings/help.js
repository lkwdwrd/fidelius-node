/**
 * The default help text to print to the screen.
 */

'use strict';

// Import dependencies
const chalk = require('chalk');

module.exports = `
${chalk.bold('fidelius <command> [args] [options]')}

General options:
  --help, -h    ${chalk.dim('# Prints this message')}
  --version, -v ${chalk.dim('# Prints the version of Fidelius')}
  --no-color    ${chalk.dim('# Output is printed without colors')}


Available commands are:
  <empty>        ${chalk.dim('# Print out the current organization and user information.')}
  new            ${chalk.dim('# Write a new secret message')}
  read [--key]   ${chalk.dim('# Read a shared secret message')}
  list           ${chalk.dim('# List unread messages you have written')}
  change org     ${chalk.dim('# Switch which organization fidelius is associated with')}
  change user    ${chalk.dim('# Switch the active user on the current organization')}
  add org        ${chalk.dim('# Add an organization for selection')}
  add user       ${chalk.dim('# Add a user to share with on the selected organization')}
  add friend     ${chalk.dim('# Add a friend to share to')}
  remove org     ${chalk.dim('# Remove an organization and all users and friends')}
  remove user    ${chalk.dim('# Remove a user from the current organization configuration')}
  remove friend  ${chalk.dim('# Remove a friend from the current organization configuration')}
  export user    ${chalk.dim('# print out a the configuration for the current user.')}
`;
