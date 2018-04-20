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
	name: 'remove-friend',
	test: args => args.input.length > 1 && args.input[0] === 'remove' && args.input[1] === 'friend',
	run: async (store) => {
		const options = store.conf.friendOptions();
		if (options.length === 0) {
			return new RouteResult(
				'warning',
				'There are currently no friends defined. Nothing to remove.',
				false,
			);
		}

		const { friends } = await inquirer.prompt([
			{
				type: 'checkbox',
				name: 'friends',
				message: 'Select users to remove:',
				choices: options,
			},
		]);
		const friendNames = friends.map(k => store.conf.friendName(k)).join(', ');
		store.printer.print(new Printable(
			'warning',
			`Removing ${friendNames} will remove your ability to share messages with them.`,
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
				`OK, ${friendNames} was/were not removed.`,
				false,
			);
		}
		try {
			friends.forEach(friend => store.conf.removeUser(friend));
			const result = new RouteResult(
				'success',
				`${friendNames} and all associated local data has/have been removed.`,
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
