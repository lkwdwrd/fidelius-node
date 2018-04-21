/**
 * A composite printer so multiple printers can be used if needed.
 */

'use strict';

// Import dependencies
const Printer = require('./Printer');
const assert = require('assert');

/**
 * The PrinterGroup composite object allows multiple printers to be used at once.
 */
class PrinterGroup extends Printer {
	/**
	 * Groups together a set of Printers so multiple outputs can be used at once.
	 *
	 * @param {object} printer A set of printing methods as needed.
	 * @param {Array<Printer>} printers An array of printer objects.
	 */
	constructor(printer = {}, printers) {
		super(printer);
		this.printers = printers;
	}
	/**
	 * Ensures when printers are access it always returns an array.
	 *
	 * @return {Array<Printer>} An array of Printer objects.
	 */
	get printers() {
		return (Array.isArray(this.printGroup)) ? this.printGroup : [];
	}
	/**
	 * Sets and validates that printers will be an array of Printer objects.
	 *
	 * @param  {Array<Printer>} printers An array of Printer objects.
	 * @return {void}
	 */
	set printers(printers) {
		assert(Array.isArray(printers), 'printers must be an array');
		assert(printers.every(p => p instanceof Printer), 'printers must be instances of Printer');

		this.printGroup = printers;
	}
	/**
	 * Prints out a confirmation on this and all printers in the print group.
	 *
	 * @param  {string} message The message to print.
	 * @return {void}
	 */
	confirm(message) {
		super.confirm(message);
		this.printers.forEach(p => p.confirm(message));
	}
	/**
	 * Prints out a success message on this and all printers in the print group.
	 *
	 * @param  {string} message The message to print.
	 * @return {void}
	 */
	success(message) {
		super.success(message);
		this.printers.forEach(p => p.success(message));
	}
	/**
	 * Prints out a warning message on this and all printers in the print group.
	 *
	 * @param  {string} message The message to print.
	 * @return {void}
	 */
	warning(message) {
		super.warning(message);
		this.printers.forEach(p => p.warning(message));
	}
	/**
	 * Prints out an error message on this and all printers in the print group.
	 *
	 * @param  {string} message The message to print.
	 * @return {void}
	 */
	error(message) {
		super.error(message);
		this.printers.forEach(p => p.error(message));
	}
	/**
	 * Prints out a raw message on this and all printers in the print group.
	 *
	 * @param  {string} message The message to print.
	 * @return {void}
	 */
	raw(message) {
		super.raw(message);
		this.printers.forEach(p => p.raw(message));
	}
}

module.exports = PrinterGroup;
