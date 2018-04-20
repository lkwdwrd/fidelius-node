/**
 * This route changes the active organization.
 */

'use strict';

// Import dependencies
const Route = require('../Route.js');
const Printable = require('../Printable');
const RouteResult = require('../RouteResult');
const inquirer = require('inquirer');
const addUser = require('./addUser');

// Define the route options.
const route = {
	name: 'change-user',
	test: args => args.input.length > 1 && args.input[0] === 'change' && args.input[1] === 'user',
	run: async (store) => {
		const userOptions = store.conf.userOptions();
		const newActive = userOptions.length > 0
			? await route.exists(userOptions)
			: await route.new(store);
		const newActiveName = store.conf.userName(newActive);
		try {
			store.conf.setCurrentUser(newActive);
			return new RouteResult(
				'success',
				`${newActiveName} is now the active user.`,
				newActive,
			);
		} catch (e) {
			return new RouteResult('error', e.message, e, 1);
		}
	},
	exists: async (options) => {
		const { newActive } = await inquirer.prompt([
			{
				type: 'list',
				name: 'newActive',
				message: 'Select a user to make active:',
				choices: options,
			},
		]);
		return newActive;
	},
	new: async (store) => {
		store.printer.print(new Printable(
			'confirm',
			'No users found. Make a new one?',
		));
		const result = await addUser.run(store);
		store.printer.print(result);
		if (result.type === 'error') {
			process.exit(result.code);
		}
		return result.data.key;
	},
};

// Export the route.
module.exports = new Route(route);
