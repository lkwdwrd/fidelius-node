/**
 * Create an initialized instance of a storage strategy.
 */

'use strict';

/**
 * Initializes the various pieces in a storage strategy.
 *
 * @param {DBConnection} DBClass The database configuration class.
 * @param {configuration} ConfigClass The config class.
 * @param {ConfigFields} ConfigFields The questions to populate config fields.
 */
module.exports = (DBClass, ConfigClass, ConfigFields) => (conf) => {
	const initializedConfig = new ConfigClass(conf);
	return {
		db: new DBClass(initializedConfig),
		conf: initializedConfig,
		fields: ConfigFields,
	};
};
