/**
 * The list route to view unread messages shared with others.
 */

'use strict';

// Import dependencies
const Route = require('../Route.js');
const inquirer = require('inquirer');
const RouteResult = require('../RouteResult');

// Define the route options.
const route = {
	name: 'list',
	test: args => args.input.length > 0 && args.input[0] === 'list',
	run: async (store) => {
		const messages = await store.db.listUserMessages();

		const options = messages.map(
			({ title, friend, key }) => ({
				name: `${title} shared with ${store.conf.friendName(friend)}`,
				value: key,
			}),
		);
		const { toEdit } = await inquirer.prompt([
			{
				type: 'checkbox',
				name: 'toEdit',
				message: 'Select messages to manage:',
				choices: options,
			},
		]);
		if (toEdit.length <= 0) {
			return new RouteResult(
				'confirm',
				'No messages selected',
				true,
			);
		}
		const editActions = [
			{ name: 'Expire Message', value: 'expire' },
			{ name: 'Cancel', value: 'cancel' },
		];
		const { action } = await inquirer.prompt(
			{
				type: 'list',
				name: 'action',
				message: 'Action:',
				choices: editActions,
			},
		);

		try {
			const result = await route[action](toEdit, store);
			return result;
		} catch (e) {
			return new RouteResult('error', e.message, e, 1);
		}
	},
	expire: async (toEdit, store) => {
		await Promise.all(toEdit.map(m => store.db.deleteMessage(m)));

		return new RouteResult(
			'success',
			'The selected messages have been expired and are no longer available.',
			true,
		);
	},
	cancel: () => new RouteResult(
		'confirm',
		'Action cancelled.',
	),
};

// Export the route.
module.exports = new Route(route);
