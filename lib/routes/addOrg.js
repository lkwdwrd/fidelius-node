/**
 * This route adds configures a new organization for use.
 */

'use strict';

// Import dependencies
const Route = require('../Route.js');
const Printable = require('../Printable');
const RouteResult = require('../RouteResult');
const inquirer = require('inquirer');

// Define the route options.
const route = {
	name: 'add-org',
	test: args => args.input.length > 1 && args.input[0] === 'add' && args.input[1] === 'org',
	run: async (store) => {
		const newOrg = await inquirer.prompt(store.fields.orgFields());
		try {
			const storedOrg = store.conf.addOrg(newOrg);
			return new RouteResult(
				'success',
				`The ${store.conf.orgName(storedOrg.key)} organization has been added`,
				storedOrg,
			);
		} catch (e) {
			// Print the error and run again recursively.
			store.printer.print([
				new Printable('error', e.message),
				new Printable('confirm', 'Try Again?'),
			]);
			return route.run(store);
		}
	},
};

// Export the route.
module.exports = new Route(route);
