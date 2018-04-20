/**
 * This is the abstract definition of what a DB configuration object should look like
 *
 * There are three levels of data, organizations, users, and friends.
 *
 * Organizations represent a grouping of users that can share data amongst
 * themselves. Users provide access to the organization. User objects stored
 * can be used to share data. Friends are users added to share data to.
 *
 * This should be turned into a concrete class for a storage strategy.
 */

'use strict';

// Import Dependencies
const assert = require('assert');
const _ = require('lodash');

/**
 * The configuration class, getting and setting config valuse for a storage strategy.
 */
class Configuration {
	/**
	 * Stores the conf object, protecting config behind a namespace in the config file.
	 *
	 * @param {object} conf The conf object that implements the needed getter and setter.
	 */
	constructor(conf) {
		// Check the layout of conf
		assert(_.isFunction(conf.get), 'conf must have a get method');
		assert(_.isFunction(conf.set), 'conf must have a set method');
		assert(_.isFunction(conf.delete), 'conf must have a delete method');
		// Check fo a non-empty namespace
		assert(_.isString(this.namespace) && this.namespace, 'namespace must be a non-empty string.');
		this.conf = {
			get: (key, noValue) => conf.get(`${this.namespace}.${key}`, noValue),
			set: (key, value) => conf.set(`${this.namespace}.${key}`, value),
			delete: key => conf.delete(`${this.namespace}.${key}`),
			clear: () => conf.set(this.namespace, {}),
		};
	}
	/**
	 * Get the namespace for this storage engine's configuration.
	 */
	get namespace() {
		throw new Error('Configuration classes must have a namespace getter');
	}
	/**
	 * Add a new organization for use with the storage engine.
	 *
	 * @param  {string} name The name of the organization to add.
	 * @param  {string}  key The registration key for the organization.
	 * @return {Object}      The organization object that was added.
	 */
	addOrg() {
		throw new Error('Configuration classes must have an addOrg method');
	}
	/**
	 * The the organizations avaialble for this storage engine.
	 *
	 * @return {Object} A set of organization objects, keyed by registartion key.
	 */
	listOrgs() {
		throw new Error('Configuration classes must have a listOrgs method');
	}
	/**
	 * Gets the registration key for the currently active organization.
	 *
	 * @return {string} The currently active organization registration key.
	 */
	currentOrgId() {
		throw new Error('Configuration classes must have a currentOrgId method');
	}
	/**
	 * Gets the organization object for the currently active organization.
	 *
	 * @return {Object} The currently active organization object.
	 */
	currentOrg() {
		throw new Error('Configuration classes must have a currentOrg method');
	}
	/**
	 * Sets an added organization as the active organization.
	 *
	 * @param  {string} key The registration key of an organization that has been added.
	 * @return {Object}     The newly set organization object.
	 */
	setCurrentOrg() {
		throw new Error('Configuration classes must have a setCurrentOrg method');
	}
	/**
	 * Removes an organization from the available organizations.
	 *
	 * @param  {string} key The registration key of the organization to remove.
	 * @return {bool}       True if the organization was removed.
	 */
	removeOrg() {
		throw new Error('Configuration classes must have a removeOrg method');
	}
	/**
	 * Adds a user for use on the currently active organization.
	 *
	 * @param {Object} user A complete user object with all secrets.
	 * @return {Object}     The added user object.
	 */
	addUser() {
		throw new Error('Configuration classes must have an addUser method');
	}
	/**
	 * Lists out the available users on the currently active organization.
	 *
	 * @return {Object} The users for the current organization, keyed by client ID.
	 */
	listUsers() {
		throw new Error('Configuration classes must have a listUsers method');
	}
	/**
	 * Gets the client ID of the currently active user for the active organization.
	 *
	 * @return {string} The currently active user ID on the active organization.
	 */
	currentUserId() {
		throw new Error('Configuration classes must have a currentUserId method');
	}
	/**
	 * Gets the currently active user object for the active organization.
	 *
	 * @return {Object} The currently active user object on the active organization.
	 */
	currentUser() {
		throw new Error('Configuration classes must have a currentUser method');
	}
	/**
	 * Sets the active user for the currently active organization.
	 *
	 * @param  {string} id The client ID of the user to set as active for the organization.
	 * @return {object}    The newly current user object.
	 */
	setCurrentUser() {
		throw new Error('Configuration classes must have a setCurrentUser method');
	}
	/**
	 * Removes a user from the active organization.
	 *
	 * @param  {string} id The client ID of the user to remove from the organization.
	 * @return {bool}      True if the user was successfully removed.
	 */
	removeUser() {
		throw new Error('Configuration classes must have a removeUser method');
	}
	/**
	 * Gets a list of friend available on the currently active organization.
	 *
	 * @return {Object} The available friend on this organization, keyed by client ID.
	 */
	listFriends() {
		throw new Error('Configuration classes must have a listFriends method');
	}
	/**
	 * Adds a friend to the available friends for the active organization.
	 *
	 * @param  {string} name The nickname for the friend to add to the friends list.
	 * @param  {string} key  The client ID for the friend to add to the friends list.
	 * @return {string}      The nickname of the friend added to the friends list.
	 */
	addFriend() {
		throw new Error('Configuration classes must have an addFriend method');
	}
	/**
	 * Removes a friend from the currently active organization.
	 *
	 * @param  {string} key The client ID of the friend to remove from this organization.
	 * @return {bool}       True if the friend was removed.
	 */
	removeFriend() {
		throw new Error('Configuration classes must have a removeFriend method');
	}
}

module.exports = Configuration;
