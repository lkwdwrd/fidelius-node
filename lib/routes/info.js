/**
 * The failsafe route that catches everything.
 *
 * This should always been last in a routes array.
 */

'use strict';

// Import dependencies
const chalk = require('chalk');
const Route = require('../Route.js');
const RouteResult = require('../RouteResult');
const Printable = require('../Printable');
const logo = require('../strings/logo.js');
const changeUser = require('./changeUser');

// Define the route options.
const route = {
	name: 'info',
	test: args => args.input.length === 0,
	run: async (store) => {
		const user = (!store.conf.currentUserId())
			? await route.setUser(store)
			: store.conf.currentUserId();
		const org = store.conf.currentOrgId();

		return new RouteResult('print', [
			new Printable('raw', chalk.blue(logo)),
			new Printable('raw', chalk.blue(`                            v${store.args.pkg.version}\n`)),
			new Printable('raw', `${chalk.blue(store.args.pkg.description)}\n`),
			new Printable('raw', `${chalk.bold('Organization:')} ${store.conf.orgName(org)} (${org})`),
			new Printable('raw', `        ${chalk.bold('User:')} ${store.conf.userName(user)} (${user})\n`),
		]);
	},
	setUser: async (store) => {
		store.printer.print(new Printable(
			'confirm',
			'No current user. Setting a user.',
		));
		const result = await changeUser.run(store);
		store.printer.print(result);
		if (result.type === 'error') {
			process.exit(result.code);
		}
		return result.data.key;
	},
};

// Export the route.
module.exports = new Route(route);
