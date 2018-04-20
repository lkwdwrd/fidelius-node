const _ = require('lodash');
const assert = require('assert');

class Printable {
	constructor(type, message) {
		this.type = type;
		this.message = message;
	}
	get type() {
		return this.whitelistedType;
	}
	set type(val) {
		const whitelist = [
			'print',
			'confirm',
			'success',
			'warning',
			'error',
			'raw',
		];
		assert(
			whitelist.includes(val),
			`A printable must be of one of the following types ${whitelist.join(', ')}`,
		);
		this.whitelistedType = val;
	}
}

module.exports = Printable;
