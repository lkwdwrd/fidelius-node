/**
 * Combine the e3db strategy into an initialized storage strategy.
 */

'use strict';

// Import dependencies
const DBConnection = require('./DBConnection');
const Configuration = require('./Configuration');
const ConfigFields = require('./ConfigFields');
const initStore = require('../../utils/initStore');

module.exports = initStore(DBConnection, Configuration, ConfigFields);
