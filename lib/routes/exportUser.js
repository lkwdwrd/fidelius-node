/**
 * The failsafe route that catches everything.
 *
 * This should always been last in a routes array.
 */

'use strict';

// Import dependencies
const Route = require('../Route.js');
const RouteResult = require('../RouteResult');

// Define the route options.
const route = {
	name: 'info',
	test: args => args.input.length > 1 && args.input[0] === 'export' && args.input[1] === 'user',
	run: async store => new RouteResult(
		'raw',
		store.conf.formatUser(),
	),
};

// Export the route.
module.exports = new Route(route);
