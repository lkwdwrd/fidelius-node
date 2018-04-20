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
	name: 'remove-org',
	test: args => args.input.length > 1 && args.input[0] === 'remove' && args.input[1] === 'org',
	run: async (store) => {
		const options = store.conf.orgOptions();
		if (options.length === 0) {
			return new RouteResult(
				'warning',
				'There are currently no organizations defined. Nothing to remove.',
				false,
			);
		}

		const { orgs } = await inquirer.prompt([
			{
				type: 'checkbox',
				name: 'orgs',
				message: 'Select organizations to remove:',
				choices: options,
			},
		]);
		const orgNames = orgs.map(k => store.conf.orgName(k)).join(', ');
		store.printer.print(new Printable(
			'warning',
			`Removing ${orgNames} will remove all users and frieds. They can not be recovered.`,
		));
		const confirmation = await inquirer.prompt([
			{
				type: 'confirm',
				name: 'confirmed',
				message: 'Are you absolutely sure you want to continue?',
			},
		]);

		if (!confirmation.confirmed) {
			return new RouteResult(
				'confirm',
				`OK, ${orgNames} was/were not removed.`,
				false,
			);
		}
		try {
			orgs.forEach(org => store.conf.removeOrg(org));
			const result = new RouteResult(
				'success',
				`${orgNames} and all associated local data has/have been removed.`,
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
