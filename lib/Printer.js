/**
 * The object that organizes output for pritable object.
 */

'use strict';

// Import dependencies
const Printable = require('./Printable');
const assert = require('assert');
const _ = require('lodash');

/**
 * Allow for the creation of printers that output to different contexts.
 */
class Printer {
	/**
	 * Constructs an object that can output Pritable objects to a context.
	 *
	 * Context could be anything from the console to a log file to a message box
	 * in a GUI. The contructor takes an object with methods that determine the
	 * specific behavior for each type of print operation. If one is not defined
	 * then message of that type are ignored.
	 *
	 * @param {object}   printer         An object with methods for how to print
	 *                                   diferent types of Printables.
	 * @param {function} printer.confirm A method for printing a confirmation.
	 * @param {function} printer.confirm A method for printing a success.
	 * @param {function} printer.confirm A method fro printing a warning.
	 * @param {function} printer.confirm A method for printing an error.
	 * @param {function} printer.confirm A method for printing a message with a
	 *                                   specific type or context.
	 * @return {Printer}                 The contstructed printer object.
	 */
	constructor(printer = {}) {
		this.userConfirm = _.isFunction(printer.confirm) ? printer.confirm : _.noop;
		this.userSuccess = _.isFunction(printer.success) ? printer.success : _.noop;
		this.userWarning = _.isFunction(printer.warning) ? printer.warning : _.noop;
		this.userError = _.isFunction(printer.error) ? printer.error : _.noop;
		this.userRaw = _.isFunction(printer.raw) ? printer.raw : _.noop;
	}
	/**
	 * Prints out a printable or set of printables.
	 *
	 * If a single printable is sent, it is printed out using the methods
	 * defined then the Printer was constructed. If an array of printable
	 * messages are sent, it print each on out in sequence. If a printable is
	 * of type 'print', then this method will call itself recursively for the
	 * printables contained in the parent printable.
	 *
	 * @param {Printable|Array<Printable>} printables A Printable message or
	 *                                                multiple messages.
	 * @return {void}
	 */
	print(printables) {
		// Take in a single printable.
		const messages = printables instanceof Printable ? [printables] : printables;
		// Typecheck.
		assert(Array.isArray(messages), 'printables must be an array');
		assert(messages.every(m => m instanceof Printable), 'printables must be of type Printable');
		// Print.
		messages.forEach(printable => this[printable.type](printable.message));
	}
	/**
	 * Prints out a confirmation message.
	 *
	 * @param {string} message The message to print.
	 * @return {void}
	 */
	confirm(message) {
		this.userConfirm(message);
	}
	/**
	 * Prints out a success message.
	 *
	 * @param {string} message The message to print.
	 * @return {void}
	 */
	success(message) {
		this.userSuccess(message);
	}
	/**
	 * Prints out a warning message.
	 *
	 * @param {string} message The message to print.
	 * @return {void}
	 */
	warning(message) {
		this.userWarning(message);
	}
	/**
	 * Prints out an error message.
	 *
	 * @param {string} message The message to print.
	 * @return {void}
	 */
	error(message) {
		this.userError(message);
	}
	/**
	 * Prints out a message with no specific context.
	 *
	 * @param {string} message The message to print.
	 * @return {void}
	 */
	raw(message) {
		this.userRaw(message);
	}
}

module.exports = Printer;
