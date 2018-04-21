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
	name: 'version',
	/**
	 * A test to determine if the version route should run.
	 *
	 * @param  {object} args The parsed cli argements object.
	 * @return {boolean}      Whether or not the route should run.
	 */
	test: args => args.input.length === 0 && args.flags.version === true,
	/**
	 * Returns the route result the formatted version info.
	 *
	 * @param {Store}        store The storage object with the current strategy set.
	 * @return {RouteResult}       The result of running the route.
	 */
	run: store => new RouteResult('raw', `${store.args.pkg.name} v${store.args.pkg.version}`),
};

// Export the route.
module.exports = new Route(route);
