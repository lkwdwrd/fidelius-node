/**
 * An object to ensure route definitions match the correct pattern.
 */

'use strict';

// import dependencies
const assert = require('assert');
const _ = require('lodash');
const defaultHelp = require('./strings/help');
/**
 * The default route class.
 *
 * Basically this is set up to act as an interface. For a route to validate
 * properly it must extend this route.
 */
class Route {
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

	run(store) {
		if (store.args.flags.help) {
			return this.help;
		}
		return this.runMethod(store);
	}
}

module.exports = Route;
