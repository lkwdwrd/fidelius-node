/**
 * This route changes the active organization.
 */

'use strict';

// Import dependencies
const Route = require('../Route.js');
const RouteResult = require('../RouteResult');
const Printable = require('../Printable');
const inquirer = require('inquirer');

// Define the route options.
const route = {
	name: 'remove-user',
	test: args => args.input.length > 1 && args.input[0] === 'remove' && args.input[1] === 'user',
	run: async (store) => {
		const options = store.conf.userOptions();
		if (options.length === 0) {
			return new RouteResult(
				'warning',
				'There are currently no users defined. Nothing to remove.',
				false,
			);
		}

		const { users } = await inquirer.prompt([
			{
				type: 'checkbox',
				name: 'users',
				message: 'Select users to remove:',
				choices: options,
			},
		]);
		const userNames = users.map(k => store.conf.userName(k)).join(', ');
		store.printer.print(new Printable(
			'warning',
			`Removing ${userNames} will remove all access to their messages. You will have to add them again to access the messages.`,
		));
		const { confirmed } = await inquirer.prompt([
			{
				type: 'confirm',
				name: 'confirmed',
				message: 'Are you absolutely sure you want to continue?',
			},
		]);

		if (!confirmed) {
			return new RouteResult(
				'confirm',
				`OK, ${userNames} was/were not removed.`,
				false,
			);
		}
		try {
			users.forEach(user => store.conf.removeUser(user));
			const result = new RouteResult(
				'success',
				`${userNames} and all associated local data has/have been removed.`,
				true,
			);
			return result;
		} catch (e) {
			return new RouteResult('error', e.message, e, 1);
		}
	},
};

// Export the route.
module.exports = new Route(route);
