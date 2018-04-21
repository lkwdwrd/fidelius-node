/**
 * An object to ensure route definitions match the correct pattern.
 */

'use strict';

// Import dependencies
const assert = require('assert');
const _ = require('lodash');
const defaultHelp = require('./strings/help');
const RouteResult = require('./RouteResult');

/**
 * The default route class.
 *
 * Basically this is set up to act as an interface. For a route to validate
 * properly it must extend this route.
 */
class Route {
	/**
	 * Creates a route object to process a cli command.
	 *
	 * @param  {object}   param0      An object containing route behavior.
	 * @param  {function} param0.test A method that inspects args and determines
	 *                                if a route should run.
	 * @param  {function} param0.run  A method defining the behavior when a
	 *                                route passes the test method.object
	 * @param  {string=}  param0.help A string to output when the route is
	 *                                called with the help flag active.
	 * @param  {string}   param0.name A name to help organize routes.
	 * @return {Route}
	 */
	constructor({
		test,
		run,
		help: help = defaultHelp,
		name: name = '',
	}) {
		assert(_.isString(name), 'A route name must be a string');
		assert(_.isString(help), 'A route\'s help text must be a string');
		assert(_.isFunction(test), 'A route must have a test function');
		assert(_.isFunction(run), 'A route must have a run function');

		this.name = name;
		this.test = test;
		this.runMethod = run;
	}
	/**
	 * Runs a route or outputs the help text if the help flag is set.
	 *
	 * @param  {Store}       store The Store object which has the provided input
	 *                             access to the current storage strategy, and
	 *                             an output printer.
	 * @return {RouteResult}       A printable route result object.
	 */
	run(store) {
		if (store.args.flags.help) {
			return new RouteResult('raw', this.help);
		}
		return this.runMethod(store);
	}
}

module.exports = Route;
