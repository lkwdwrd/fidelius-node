/**
 * A composite printer so multiple printers can be used if needed.
 */

// Import Dependencies
const Printer = require('./Printer');
const assert = require('assert');

/**
 * The PrinterGroup composite object allows multiple printers to be used at once.
 */
class PrinterGroup extends Printer {
	constructor(printer = {}, printers) {
		super(printer);
		this.printers = printers;
	}

	get printers() {
		return (Array.isArray(this.printGroup)) ? this.printGroup : [];
	}

	set printers(printers) {
		assert(Array.isArray(printers), 'printers must be an array');
		assert(printers.every(p => p instanceof Printer), 'printers must be instances of Printer');

		this.printGroup = printers;
	}

	confirm(message) {
		super.confirm(message);
		this.printers.forEach(p => p.confirm(message));
	}

	success(message) {
		super.success(message);
		this.printers.forEach(p => p.success(message));
	}

	warning(message) {
		super.warning(message);
		this.printers.forEach(p => p.warning(message));
	}

	error(message) {
		super.error(message);
		this.printers.forEach(p => p.error(message));
	}

	raw(message) {
		super.raw(message);
		this.printers.forEach(p => p.raw(message));
	}
}

module.exports = PrinterGroup;
