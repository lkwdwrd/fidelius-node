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
	globalConf: (args, config) => {
		return Object.assign(
			config.get('fideliusGlobal', { store: 'e3db', printers: ['console'] }),
			_.pick(args.flags, ['store']),
		);
	},
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
	run: async (routes, store) => {
		const route = routes.find(r => r.test(store.args)) || noRoute;

		try {
			const result = await route.run(store);
			return result;
		} catch (e) {
			return new RouteResult('error', e.message, e, 1);
		}
	},
	finish: async (result, store) => {
		const finished = await result;
		store.printer.print(finished);
		process.exit(result.code);
	},
};
