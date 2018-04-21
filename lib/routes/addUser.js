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
	name: 'add-users',
	test: args => args.input.length > 1 && args.input[0] === 'add' && args.input[1] === 'user',
	run: async (store) => {
		// Make sure a current org is set.
		if (!store.conf.currentOrgId()) {
			await route.setOrg(store);
		}

		const { newOrExist } = await inquirer.prompt([
			{
				type: 'list',
				name: 'newOrExist',
				message: 'Create a new user, or use an existing one?',
				choices: ['New', 'Existing'],
			},
		]);

		const user = (newOrExist === 'Existing')
			? await inquirer.prompt(store.fields.existingUserFields())
			: await route.addNew(store);

		try {
			const result = store.conf.addUser(user);
			return new RouteResult(
				'success',
				`${store.conf.userName(result.key)} has been added.`,
				result,
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
	addNew: async (store) => {
		const seedData = await inquirer.prompt(store.fields.newUserFields());
		const user = await store.db.register(seedData);
		return user;
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
