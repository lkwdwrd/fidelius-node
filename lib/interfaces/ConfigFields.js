/**
 * This object defines the fields needed for oragnizations, users, and friends.
 *
 * Each storage strategy may need different fields. This provides them that flexibility.
 *
 * This should be turned into a concrete class for a storage strategy.
 */

'use strict';

/**
 * The configuration class, getting and setting config values for a storage strategy.
 */
class ConfigFields {
	/**
	 * Get the fields required to add an organization.
	 */
	static orgFields() {
		throw new Error('ConfigFields classes must have a static orgFields method');
	}
	/**
	 * Get the fields required to add a new user object.
	 */
	static newUserFields() {
		throw new Error('ConfigFields classes must have a static newUserFields method');
	}
	/**
	 * Get the fields required to add an existing user object.
	 */
	static existingUserFields() {
		throw new Error('ConfigFields classes must have a static existingUserFields method');
	}
	/**
	 * Get the fields required to add a friend.
	 */
	static friendFields() {
		throw new Error('ConfigFields classes must have a static friendFields method');
	}
}

module.exports = ConfigFields;
