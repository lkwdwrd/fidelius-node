/**
 * An object providing access to the various data sources.
 */

'use strict';

// Import Dependencies
const assert = require('assert');
const Configuration = require('./interfaces/Configuration');
const ConfigFields = require('./interfaces/ConfigFields');
const DBConnection = require('./interfaces/DBConnection');
const Printer = require('./Printer');

/**
 * The store class, which contains the sources and sinks for the application.
 */
class Store {
	constructor({
		args,
		conf,
		fields,
		db,
		printer,
	} = {}) {
		this.args = args;
		this.conf = conf;
		this.fields = fields;
		this.db = db;
		this.printer = printer;
	}

	get args() {
		if (this.hidden_args) {
			return this.hidden_args;
		}

		throw new Error('args must be set before it is accessed');
	}

	set args(args) {
		// Duck type to see if args matches the expected object structure.
		assert(typeof args === 'object', 'args must be an object.');
		assert(Array.isArray(args.input), 'args.input must be an array');
		assert(typeof args.flags === 'object', 'args.flags must be an object');
		assert(typeof args.pkg === 'object', 'args.pkg must be an object');

		this.hidden_args = args;
	}

	get conf() {
		if (this.hidden_conf) {
			return this.hidden_conf;
		}
		throw new Error('conf must be set before it is accessed.');
	}

	set conf(conf) {
		if (!(conf instanceof Configuration)) {
			throw new Error('The configuration must be an instance of Configuartion');
		}
		this.hidden_conf = conf;
	}

	get fields() {
		if (this.hidden_fields) {
			return this.hidden_fields;
		}
		throw new Error('fields must be set before it is accessed.');
	}

	set fields(fields) {
		if (!(fields.prototype instanceof ConfigFields)) {
			throw new Error('Fields must be descended from ConfigFields');
		}
		this.hidden_fields = fields;
	}

	get db() {
		if (this.hidden_db) {
			return this.hidden_db;
		}
		throw new Error('db must be set before it is accessed.');
	}

	set db(db) {
		if (!(db instanceof DBConnection)) {
			throw new Error('The database must be an instance of DBConnection.');
		}
		this.hidden_db = db;
	}

	get printer() {
		if (this.hidden_printer) {
			return this.hidden_printer;
		}
		throw new Error('printer must be set before it is accessed.');
	}

	set printer(printer) {
		if (!(printer instanceof Printer)) {
			throw new Error('The printer must be an instance of Printer.');
		}
		this.hidden_printer = printer;
	}
}

module.exports = Store;
