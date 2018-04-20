module.exports = (DBClass, ConfigClass, ConfigFields) => (conf) => {
	const initializedConfig = new ConfigClass(conf);
	return {
		db: new DBClass(initializedConfig),
		conf: initializedConfig,
		fields: ConfigFields,
	};
};
