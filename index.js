'use strict';

// Import dependencies
const fidelius = require('./lib/main');
const argsParser = require('./lib/utils/argsParser');
const Conf = require('conf');
const routes = require('./lib/routes');

module.exports = {
	fidelius,
	argsParser,
	routes,
	Conf,
};
