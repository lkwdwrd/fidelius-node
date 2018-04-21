/**
 * The list route to view unread messages shared with others.
 */

'use strict';

// Import dependencies
const Route = require('../Route.js');
const inquirer = require('inquirer');
const RouteResult = require('../RouteResult');
const formatMessage = require('../strings/formatMessage');

// Define the route options.
const route = {
	name: 'read',
	test: args => args.input.length > 0 && args.input[0] === 'read',
	run: async (store) => {
		let messageId;

		if (store.args.flags.key) {
			messageId = store.args.flags.key;
		} else {
			const messages = await store.db.listSharedMessages();
			const options = messages.map(
				({ title, author, key }) => ({
					name: `${title} shared by ${store.conf.friendName(author)}`,
					value: key,
				}),
			);
			const { inquirerId } = await inquirer.prompt([
				{
					type: 'list',
					name: 'inquirerId',
					message: 'Select a message to read:',
					choices: options,
				},
			]);
			messageId = inquirerId;
		}

		try {
			const message = await store.db.readMessage(messageId);
			return new RouteResult(
				'raw',
				formatMessage(message, store),
				message,
			);
		} catch (e) {
			return new RouteResult('error', e.message, e, 1);
		}
	},
};

// Export the route.
module.exports = new Route(route);
