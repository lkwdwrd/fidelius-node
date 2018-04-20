/**
 * A wrapper around meow to set some specific options for our application.
 */

'use strict';

// Import dependencies
const meow = require('meow');

/**
 * A wrapper around meow to set it up for this CLI environment.
 *
 * @param {Array} args An array of command line arguments for parsing.
 */
const parser = args => meow({
	argv: args,
	autoHelp: false,
	autoVersion: false,
	flags: {
		help: {
			type: 'boolean',
			alias: 'h',
		},
		version: {
			type: 'boolean',
			alias: 'v',
		},
	},
});

module.exports = parser;
