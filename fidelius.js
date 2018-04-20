#!/usr/bin/env node
/**
 * The entry point for the application.
 *
 * This grabs the command line arguments, the global config, sets up the
 * configured storage strategy, and then runs the application.
 */

'use strict';

// Import dependencies
const {
	fidelius,
	argsParser,
	routes,
	Conf,
} = require('./index');

// parse args
const args = argsParser(process.argv.slice(2));
// hook up the config file
const config = new Conf({ encryptionKey: 'fideliusConfigLock' });
// get global config
const globalConf = fidelius.globalConf(args, config);
// get the current storage strategy
const store = fidelius.getStore(globalConf, args, config);
// run the application
fidelius.finish(fidelius.run(routes, store), store);
