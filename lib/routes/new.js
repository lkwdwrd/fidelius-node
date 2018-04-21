/**
 * The route to create a new message and share it with a friend or friends.
 */

'use strict';

// Import dependencies
const Route = require('../Route.js');
const inquirer = require('inquirer');
const RouteResult = require('../RouteResult');
const addFriend = require('./addFriend');

// Define the route options.
const route = {
	name: 'info',
	test: args => args.input.length > 0 && args.input[0] === 'new',
	run: async (store) => {
		// Create the message
		const options = ['New Friend'].concat(store.conf.friendOptions());
		const { title, message, friends } = await inquirer.prompt([
			{
				type: 'input',
				name: 'title',
				message: 'Message Title:',
			},
			{
				type: 'editor',
				name: 'message',
				message: 'Message:',
				validate: (a) => {
					const valid = a.length > 0;
					return valid || 'Please enter a message.';
				},
			},
			{
				type: 'checkbox',
				name: 'friends',
				message: 'Who should this message be shared with?',
				choices: options,
				validate: (a) => {
					const valid = a.length > 0;
					return valid || 'Share with at least one friend';
				},
			},
		]);
		try {
			// Get the final share to list, with a new friend added if requested.
			const shareTo = !friends.includes('New Friend')
				? friends
				: friends
					.filter(v => v !== 'New Friend')
					.concat([await route.newFriend(store)]);

			await Promise.all(shareTo.map(
				friend => store.db.createMessage(message, title, friend),
			));
			return new RouteResult(
				'success',
				`The messsage ${title} has been shared.`,
			);
		} catch (e) {
			return new RouteResult('error', e.message, e, 1);
		}
	},
	newFriend: async (store) => {
		try {
			const result = await addFriend.run(store);
			store.printer.print(result);
			if (result.type === 'error') {
				process.exit(result.code);
			}
			return result.data.key;
		} catch (e) {
			throw e;
		}
	},
};

// Export the route.s
module.exports = new Route(route);
