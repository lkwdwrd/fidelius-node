/**
 * Represents the result of running a route.
 */

'use strict';

// Import Dependencies
const Printable = require('./Printable');

/**
 * The result of running a route.
 *
 * An extension of printable with the abiltiy to store data and an exit code.
 */
class RouteResult extends Printable {
	/**
	 * Constructor for the printable Route Result.
	 *
	 * @param {String}  type    The type of result.
	 * @param {String}  message The message to print with the result.
	 * @param {*}       data    The data generated from the route.
	 * @param {Number} [exit=0] The exit code to use with the route completed.
	 *                          Default: 0
	 */
	constructor(type, message, data, exit = 0) {
		super(type, message);
		this.data = data;
		this.exit = parseInt(exit, 10);
	}
}

module.exports = RouteResult;
