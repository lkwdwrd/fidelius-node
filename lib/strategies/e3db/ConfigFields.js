/**
 * This object defines the fields needed for oragnizations, users, and friends on e3db.
 */

'use strict';

// Import dependencies
const ConfigFields = require('../../interfaces/ConfigFields');

/**
 * The configuration class, getting and setting config values for a storage strategy.
 */
class E3DBConfigFields extends ConfigFields {
	/**
	 * Get the fields required to add a new e3db organization.
	 *
	 * @return {Array<object>} An array of question objects.
	 */
	static orgFields() {
		return [
			{
				type: 'input',
				name: 'key',
				message: 'Organization Token:',
				validate: (a) => {
					const valid = /^[0-9a-f]{64}$/.test(a);
					return valid || 'A token will be 64 characters long.';
				},
			},
			{
				type: 'input',
				name: 'name',
				message: 'Organization Name (for local use):',
				validate: (a) => {
					const valid = a.length > 0;
					return valid || 'Please enter an organization name.';
				},
			},
		];
	}
	/**
	 * Get the fields required to add a new e3db user object.
	 *
	 * @return {Array<object>} An array of question objects.
	 */
	static newUserFields() {
		return [
			{
				type: 'input',
				name: 'name',
				message: 'User Nickname:',
				validate: (a) => {
					const valid = a.length > 0;
					return valid || 'Please enter a user nickname.';
				},
			},
		];
	}
	/**
	 * Get the fields required to add an existing e3db user object.
	 *
	 * @return {Array<object>} An array of question objects.
	 */
	static existingUserFields() {
		return [
			{
				type: 'input',
				name: 'key',
				message: 'Client ID:',
				validate: (a) => {
					const valid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(a);
					return valid || 'A token will be a sequence of numbers and letters separated by dashes 36 characters long.';
				},
			},
			{
				type: 'input',
				name: 'api_key_id',
				message: 'API Key ID:',
				validate: (a) => {
					const valid = /^[0-9a-f]{64}$/.test(a);
					return valid || 'An API key ID will be 64 characters long.';
				},
			},
			{
				type: 'input',
				name: 'api_secret',
				message: 'API Secret:',
				validate: (a) => {
					const valid = /^[0-9a-f]{64}$/.test(a);
					return valid || 'An API secret will be 64 characters long.';
				},
			},
			{
				type: 'input',
				name: 'public_key',
				message: 'Public Key:',
				validate: (a) => {
					const valid = /^[a-zA-Z0-9_-]{43}$/.test(a);
					return valid || 'A public key will be 43 characters long.';
				},
			},
			{
				type: 'input',
				name: 'private_key',
				message: 'Private Key:',
				validate: (a) => {
					const valid = /^[a-zA-Z0-9_-]{43}$/.test(a);
					return valid || 'A private key will be 43 characters long.';
				},
			},
			{
				type: 'input',
				name: 'public_signing_key',
				message: 'Public Signing Key:',
				validate: (a) => {
					const valid = /^[a-zA-Z0-9_-]{43}$/.test(a);
					return valid || 'A public signing key will be 43 characters long.';
				},
			},
			{
				type: 'input',
				name: 'private_signing_key',
				message: 'Private Signing Key:',
				validate: (a) => {
					const valid = /^[a-zA-Z0-9_-]{86}$/.test(a);
					return valid || 'A private signing key will be 86 characters long.';
				},
			},
			{
				type: 'input',
				name: 'name',
				message: 'User Nickname:',
				validate: (a) => {
					const valid = a.length > 0;
					return valid || 'Please enter a user nickname.';
				},
			},
		];
	}
	/**
	 * Get the fields required to add an e3db friend.
	 *
	 * @return {Array<object>} An array of question objects.
	 */
	static friendFields() {
		return [
			{
				type: 'input',
				name: 'key',
				message: 'Client ID:',
				validate: (a) => {
					const valid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(a);
					return valid || 'A token will be a sequence of numbers and letters separated by dashes 36 characters long.';
				},
			},
			{
				type: 'input',
				name: 'name',
				message: 'Friend\'s Nickname (for local use):',
				validate: (a) => {
					const valid = a.length > 0;
					return valid || 'Please enter a nickname for this friend.';
				},
			},
		];
	}
}

module.exports = E3DBConfigFields;
