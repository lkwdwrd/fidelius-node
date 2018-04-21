/**
 * The main fidelius file coordinating the flow of the application.
 *
 * This file exports a function that creats a flow object, and provides a 'main'
 * method for running the application.
 */

'use strict';

// Import dependencies
const _ = require('lodash');
const stores = require('./strategies');
const printers = require('./printers');
const Store = require('./Store');
const PrintGroup = require('./PrintGroup');
const RouteResult = require('./RouteResult');
const noRoute = require('./routes/noRoute');

/**
 * Creates a fidelius flow object.
 *
 * This is done as a function so that every time a flow is created, it is a new
 * copy rather than using the same instance over and over. The object is
 * intended to be mutable for testing purposes to different parts of the flow
 * can be replaced.
 */
module.exports = {
	/**
	 * Get the global configuration from the Conf object.
	 *
	 * @param  {object} args   The parse arguments from the command line.
	 * @param  {Conf}   config The config object to gather global config from.
	 * @return {object}        The global configuration information.
	 */
	globalConf: (args, config) => {
		return Object.assign(
			config.get('fideliusGlobal', { store: 'e3db', printers: ['console'] }),
			_.pick(args.flags, ['store']),
		);
	},
	/**
	 * Get a storage object based on the globally configured store and printers.
	 *
	 * @param  {object} globalConf The global configuration object.
	 * @param  {object} args       The parsed arguments from the command line.
	 * @param  {Conf}   config     The conf object to get to the stored file.
	 * @return {Store}             The Store object to use in the application.
	 */
	getStore: (globalConf, args, config) => {
		const dbStore = stores[globalConf.store](config);
		const activePrinters = _.toPairs(printers)
			.filter(p => globalConf.printers.includes(p[0]))
			.map(p => p[1]);

		return new Store({
			args,
			printer: new PrintGroup({}, activePrinters),
			...dbStore,
		});
	},
	/**
	 * Runs the application based on a set of routes and a storage strategy.
	 *
	 * @param {Array<Route>} routes The array of route objects to search.
	 * @param {Store}        store  The Store object with inputes and outputs.
	 * @return {RouteResult}        The printable result of running the route.
	 */
	run: async (routes, store) => {
		const route = routes.find(r => r.test(store.args)) || noRoute;

		try {
			const result = await route.run(store);
			return result;
		} catch (e) {
			return new RouteResult('error', e.message, e, 1);
		}
	},
	/**
	 * Fnalize an application, printing the result and exiting.
	 *
	 * @param {RouteResult} result The printable result of running a route.
	 * @param {Store}       store  The storage object with inputs and outputs.
	 * @return {void}
	 */
	finish: async (result, store) => {
		const finished = await result;
		store.printer.print(finished);
		process.exit(result.code);
	},
};
