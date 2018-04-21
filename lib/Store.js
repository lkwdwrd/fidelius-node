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
	/**
	 * Creates a Store object, with methods for input and output in the app.
	 *
	 * @param  {object}        param0         An object with the different
	 *                                        storage strategies.
	 * @param  {object}        param0.args    An object with the parsed CLI
	 *                                        arguments.
	 * @param  {Configuration} param0.conf    An object with methods for getting
	 *                                        and setting configuration state.
	 * @param  {ConfFields}    param0.fields  A class with static methods
	 *                                        returning the fields needed for
	 *                                        different configs.
	 * @param  {DBConnection}  param0.db      A database storage strategy.
	 * @param  {Printer}       param0.printer A printer instance for outputting
	 *                                        messages in the app.
	 * @return {Store}                        A constructed Store object.
	 */
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
	/**
	 * Gets the args, or throws an error if no args object is available.
	 *
	 * @return {object} The args object with parsed CLI arguments.
	 */
	get args() {
		if (this.hidden_args) {
			return this.hidden_args;
		}

		throw new Error('args must be set before it is accessed');
	}
	/**
	 * Sets and validates the args object.
	 *
	 * @param  {object} args The parsed CLI arguments with specific properties.
	 * @return {void}
	 */
	set args(args) {
		// Duck type to see if args matches the expected object structure.
		assert(typeof args === 'object', 'args must be an object.');
		assert(Array.isArray(args.input), 'args.input must be an array');
		assert(typeof args.flags === 'object', 'args.flags must be an object');
		assert(typeof args.pkg === 'object', 'args.pkg must be an object');

		this.hidden_args = args;
	}
	/**
	 * Gets the conf object, or throws an error if no conf object is available.
	 *
	 * @return {object} The conf object with configuration get and set methods.
	 */
	get conf() {
		if (this.hidden_conf) {
			return this.hidden_conf;
		}
		throw new Error('conf must be set before it is accessed.');
	}
	/**
	 * Sets and validates the conf object.
	 *
	 * @param  {Configuration} conf A Configuration for the storage strategy.
	 * @return {void}
	 */
	set conf(conf) {
		if (!(conf instanceof Configuration)) {
			throw new Error('The configuration must be an instance of Configuartion');
		}
		this.hidden_conf = conf;
	}
	/**
	 * Gets the fields class, or throws an error if no fields class is available.
	 *
	 * @return {class} The fields class for getting this storage strategy's
	 *                 information gathering inputs.
	 */
	get fields() {
		if (this.hidden_fields) {
			return this.hidden_fields;
		}
		throw new Error('fields must be set before it is accessed.');
	}
	/**
	 * Sets and validates the fields class.
	 *
	 * @param  {ConfigFields} fields A ConfigFields class the storage strategy.
	 * @return {void}
	 */
	set fields(fields) {
		if (!(fields.prototype instanceof ConfigFields)) {
			throw new Error('Fields must be descended from ConfigFields');
		}
		this.hidden_fields = fields;
	}
	/**
	 * Gets the db object, or throws an error if no db object is available.
	 *
	 * @return {DBConnection} The database object for the storage strategy.
	 */
	get db() {
		if (this.hidden_db) {
			return this.hidden_db;
		}
		throw new Error('db must be set before it is accessed.');
	}
	/**
	 * Sets and validates the database object.
	 *
	 * @param  {DBConnection} db An adapter for the database for this strategy.
	 * @return {void}
	 */
	set db(db) {
		if (!(db instanceof DBConnection)) {
			throw new Error('The database must be an instance of DBConnection.');
		}
		this.hidden_db = db;
	}
	/**
	 * Gets the printer object, or throws an error if no printer is available.
	 *
	 * @return {Printer} The database object for the storage strategy.
	 */
	get printer() {
		if (this.hidden_printer) {
			return this.hidden_printer;
		}
		throw new Error('printer must be set before it is accessed.');
	}
	/**
	 * Sets and validates the printer object.
	 *
	 * @param  {Printer} printer A printer for outputting messages in the app.
	 * @return {void}
	 */
	set printer(printer) {
		if (!(printer instanceof Printer)) {
			throw new Error('The printer must be an instance of Printer.');
		}
		this.hidden_printer = printer;
	}
}

module.exports = Store;
