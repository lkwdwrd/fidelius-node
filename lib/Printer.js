/**
 * The object that organizes output for pritable object.
 */

'use strict';

// Import dependencies
const Printable = require('./Printable');
const assert = require('assert');
const _ = require('lodash');

class Printer {
	constructor(printer = {}) {
		this.userConfirm = _.isFunction(printer.confirm) ? printer.confirm : _.noop;
		this.userSuccess = _.isFunction(printer.success) ? printer.success : _.noop;
		this.userWarning = _.isFunction(printer.warning) ? printer.warning : _.noop;
		this.userError = _.isFunction(printer.error) ? printer.error : _.noop;
		this.userRaw = _.isFunction(printer.raw) ? printer.raw : _.noop;
	}
	print(printables) {
		// Take in a single printable.
		const messages = printables instanceof Printable ? [printables] : printables;
		// Typecheck.
		assert(Array.isArray(messages), 'printables must be an array');
		assert(messages.every(m => m instanceof Printable), 'printables must be of type Printable');
		// Print.
		messages.forEach(printable => this[printable.type](printable.message));
	}

	confirm(message) {
		this.userConfirm(message);
	}

	success(message) {
		this.userSuccess(message);
	}

	warning(message) {
		this.userWarning(message);
	}

	error(message) {
		this.userError(message);
	}

	raw(message) {
		this.userRaw(message);
	}
}

module.exports = Printer;
