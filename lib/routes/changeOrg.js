/**
 * This route changes the active organization.
 */

'use strict';

// Import dependencies
const Route = require('../Route.js');
const Printable = require('../Printable');
const RouteResult = require('../RouteResult');
const inquirer = require('inquirer');
const addOrg = require('./addOrg');

// Define the route options.
const route = {
	name: 'change-org',
	test: args => args.input.length > 1 && args.input[0] === 'change' && args.input[1] === 'org',
	run: async (store) => {
		const orgOptions = store.conf.orgOptions();
		const newActive = orgOptions.length > 0
			? await route.exists(orgOptions)
			: await route.new(store);
		const newActiveName = store.conf.orgName(newActive);
		try {
			store.conf.setCurrentOrg(newActive);
			return new RouteResult(
				'success',
				`${newActiveName} is now the active organization.`,
				newActive,
			);
		} catch (e) {
			return new RouteResult('error', e.message, e, 1);
		}
	},
	exists: async (options) => {
		const details = await inquirer.prompt([
			{
				type: 'list',
				name: 'newActive',
				message: 'Select an organization to make active:',
				choices: options,
			},
		]);
		return details.newActive;
	},
	new: async (store) => {
		store.printer.print(new Printable(
			'confirm',
			'No organizations found. Make a new one?',
		));
		const result = await addOrg.run(store);
		store.printer.print(result);
		if (result.type === 'error') {
			process.exit(result.code);
		}
		return result.data.key;
	},
};

// Export the route.
module.exports = new Route(route);
