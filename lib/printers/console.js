/**
 * The console printer -- outputting to the node console.
 */

'use strict';

// Import dependencies
const chalk = require('chalk');
const Printer = require('../Printer');

/**
 * Output a message with a set of colored arrows.
 *
 * @param {string} color The color of arrows to output.
 * @param {string} message The message to output to the console.
 */
const arrows = (color, message) => `${chalk[color]('>>')} ${message}`;

module.exports = new Printer({
	/**
	 * Output a message to the console with blue arrows.
	 *
	 * @param  {string} message The message to send to the console.
	 * @return {void}
	 */
	confirm: (message) => {
		console.log(arrows('blue', message));
	},
	/**
	 * Output a message to the console with green arrows.
	 *
	 * @param  {string} message The message to send to the console.
	 * @return {void}
	 */
	success: (message) => {
		console.log(arrows('green', message));
	},
	/**
	 * Output a message to the console with yellow arrows.
	 *
	 * @param  {string} message The message to send to the console.
	 * @return {void}
	 */
	warning: (message) => {
		console.log(arrows('yellow', message));
	},
	/**
	 * Output a message to the console with red arrows.
	 *
	 * @param  {string} message The message to send to the console.
	 * @return {void}
	 */
	error: (message) => {
		console.error(arrows('red', message));
	},
	/**
	 * Output a message to the console with no arrows.
	 *
	 * @param  {string} message The message to send to the console.
	 * @return {void}
	 */
	raw: (message) => {
		console.log(message);
	},
});
