/**
 * This route configures a new user for use with the current organization.
 */

'use strict';

// Import dependencies
const Route = require('../Route.js');
const changeOrg = require('./changeOrg');
const RouteResult = require('../RouteResult');
const Printable = require('../Printable');
const inquirer = require('inquirer');

// Define the route options.
const route = {
	name: 'add-friend',
	test: args => args.input.length > 1 && args.input[0] === 'add' && args.input[1] === 'friend',
	run: async (store) => {
		// Make sure a current org is set.
		if (!store.conf.currentOrgId()) {
			await route.setOrg(store);
		}

		const friend = await inquirer.prompt(store.fields.friendFields());

		try {
			const result = store.conf.addFriend(friend);
			return new RouteResult(
				'success',
				`${store.conf.friendName(result.key)} has been added.`,
				result,
			);
		} catch (e) {
			return new RouteResult('error', e.message, e, 1);
		}
	},
	setOrg: async (store) => {
		store.printer.print(new Printable(
			'confirm',
			'No current organization. Setting a new current organization.',
		));
		const result = await changeOrg.run(store);
		store.printer.print(result);
		if (result.type === 'error') {
			process.exit(result.code);
		}
		return result.data.key;
	},
};

// Export the route.
module.exports = new Route(route);
