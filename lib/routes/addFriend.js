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
	/**
	 * A test to determine if the add friend route should run.
	 *
	 * @param  {object} args The parsed cli argements object.
	 * @return {boolean}      Whether or not the route should run.
	 */
	test: args => args.input.length > 1 && args.input[0] === 'add' && args.input[1] === 'friend',
	/**
	 * Adds a friend to the current configurtion.
	 *
	 * If an organization is not set, it runs the set org route first.
	 *
	 * @param {Store}        store The storage object with the current strategy set.
	 * @return {RouteResult}       The result of running the route.
	 */
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
	/**
	 * Run the change org route if needed.
	 *
	 * @param  {Store}  store The storage object with the current strategy set.
	 * @return {string}       The new current org ID key.
	 */
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
