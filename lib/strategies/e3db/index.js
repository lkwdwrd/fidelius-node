// Import Dependencies
const DBConnection = require('./DBConnection');
const Configuration = require('./Configuration');
const ConfigFields = require('./ConfigFields');
const initStore = require('../../utils/initStore');

module.exports = initStore(DBConnection, Configuration, ConfigFields);
