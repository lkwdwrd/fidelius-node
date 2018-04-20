/**
 * The failsafe route that catches everything.
 *
 * This should always been last in a routes array.
 */

'use strict';

// Import dependencies
const chalk = require('chalk');
const Route = require('../Route.js');
const Printable = require('../Printable');

// Define the route options.
const route = {
	name: 'no-route',
	test: () => true,
	run: () => [
		new Printable('error', 'Command not found!'),
		new Printable('raw', `It's 'Levi-O-sa', not 'Levio-sA'. Try '${chalk.bold('fidelius -h')}' for help.\n`),
	],
};

// Export the route.
module.exports = new Route(route);
