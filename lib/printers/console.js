/**
 * The console printer -- outputting to the node console.
 */

// Import Dependencies
const chalk = require('chalk');
const Printer = require('../Printer');

const arrows = (color, message) => `${chalk[color]('>>')} ${message}`;

module.exports = new Printer({
	confirm: (message) => {
		console.log(arrows('blue', message));
	},
	success: (message) => {
		console.log(arrows('green', message));
	},
	warning: (message) => {
		console.log(arrows('yellow', message));
	},
	error: (message) => {
		console.error(arrows('red', message));
	},
	raw: (message) => {
		console.log(message);
	},
});
