/**
 * The concrete e3db configuration storage strategy.
 *
 * TODO: since data structure is now somewhat standardized, much of this can be
 * combined into single helper methods.
 */

// Import Dependencies
const _ = require('lodash');
const Configuration = require('../../interfaces/Configuration');

/**
 * The e3db configuration definition.
 */
class E3DBConfiguration extends Configuration {
	/**
	 * Return the e3db namespace.
	 *
	 * @return {string} The e3db namespace.
	 */
	get namespace() {
		return 'e3db';
	}
	/**
	 * Add a new organization for use with the storage engine.
	 *
	 * @param  {Object} newOrg The raw object with the name and key for the organization.
	 * @return {Object}        The organization object that was added.
	 */
	addOrg(newOrg) {
		const existingOrg = this.conf.get(`orgs.${newOrg.key}`);
		if (existingOrg) {
			throw new Error(`The ${existingOrg.name} organization already exists for the key ${newOrg.key}`);
		}
		const fullOrgObject = {
			key: newOrg.key,
			name: newOrg.name,
			currentUser: null,
			users: {},
		};
		this.conf.set(`orgs.${newOrg.key}`, fullOrgObject);
		return Object.assign({}, fullOrgObject);
	}

	/**
	 * List the available organizations for know for e3db.
	 *
	 * @return {Object} A set of organization objects, keyed by registartion key.
	 */
	listOrgs() {
		return this.conf.get('orgs', {});
	}
	/**
	 * Like listOrgs, except it lists as a set of key value pairs for options.
	 *
	 * @return {Object} A lit of key: name pairs for use as selectable options.
	 */
	orgOptions() {
		return _.toPairs(this.listOrgs()).map(org => ({ name: org[1].name, value: org[0] }));
	}
	/**
	 * Geta an display friendly name for an organization.
	 *
	 * @param  {string} Key The key of the organzation to get the display name for.
	 * @return {string}     The display-friendly name of the oragnization.
	 */
	orgName(key) {
		const orgs = this.listOrgs();
		return (orgs[key]) ? orgs[key].name : key;
	}
	/**
	 * Gets the registration key for the currently active organization.
	 *
	 * @return {string} The currently active organization registration key.
	 */
	currentOrgId() {
		return this.conf.get('currentOrg');
	}
	/**
	 * Gets the organization object for the currently active organization.
	 *
	 * @return {Object} The currently active organization object.
	 */
	currentOrg() {
		return this.listOrgs()[this.currentOrgId()];
	}
	/**
	 * Sets an added organization as the active organization.
	 *
	 * @param  {string} key The registration key of an organization that has been added.
	 * @return {Object}     The newly set organization object.
	 */
	setCurrentOrg(key) {
		const orgs = this.listOrgs();
		if (!orgs[key]) {
			throw new Error(`No organization defined for ID: ${key}`);
		}
		this.conf.set('currentOrg', key);
		return this.currentOrg();
	}
	/**
	 * Removes an organization from the available organizations.
	 *
	 * @param  {string} key The registration key of the organization to remove.
	 * @return {bool}       True if the organization was removed.
	 */
	removeOrg(key) {
		// Remove the current org if this org is it.
		if (key === this.currentOrgId()) {
			this.conf.delete('currentOrg');
		}
		// Remove the org
		this.conf.delete(`orgs.${key}`);
		return true;
	}
	/**
	 * Adds a user for use on the currently active organization.
	 *
	 * @param {Object} user A complete user object with all secrets.
	 * @return {Object}     The added user object.
	 */
	addUser(user) {
		// validate user object
		const whitelist = [
			'public_key',
			'private_key',
			'public_signing_key',
			'private_signing_key',
			'api_key_id',
			'api_secret',
			'name',
			'key',
		];
		// Whitelist keys and remove empty values.
		const validatedUser = _.pickBy(user, (v, k) => _.indexOf(whitelist, k) !== -1 && user[k]);
		// Set the static values for compat with the Java SDK.
		validatedUser.version = 2;
		validatedUser.api_url = 'https://api.e3db.com';
		// With the keys whitelisted and check for non-empty, see if the length is right.
		if (_.keys(validatedUser).length < 10) {
			throw new Error('The user object is incomplete.');
		}
		const existingUser = this.conf.get(`orgs.${this.currentOrgId()}.users.${validatedUser.key}`);
		if (existingUser) {
			throw new Error(`The user ${existingUser.name} already exsists at ID ${existingUser.key} on this organization.`);
		}
		this.conf.set(
			`orgs.${this.currentOrgId()}.users.${validatedUser.key}`,
			validatedUser,
		);
		return Object.assign({}, validatedUser);
	}
	/**
	 * Formats the current user's data for printing.
	 */
	formatUser() {
		const user = this.currentUser();
		return `
Name (Client Email): ${user.name}
Key (Client ID): ${user.key}
API Key ID: ${user.api_key_id}
API Secret: ${user.api_secret}
Public Key: ${user.public_key}
Private Key: ${user.private_key}
Public Signing Key: ${user.public_signing_key}
Private Signing Key: ${user.private_signing_key}
`;
	}
	/**
	 * Lists out the available users on the currently active organization.
	 *
	 * @return {Object} The users for the current organization, keyed by client ID.
	 */
	listUsers() {
		return this.conf.get(`orgs.${this.currentOrgId()}.users`, {});
	}
	/**
	 * Like listUsers, except it lists as a set of key value pairs for options.
	 *
	 * @return {Object} A lit of key: name pairs for use as selectable options.
	 */
	userOptions() {
		return _.toPairs(this.listUsers()).map(user => ({ name: user[1].name, value: user[0] }));
	}
	/**
	 * Geta an display friendly name for a user.
	 *
	 * @param  {string} Key The key of the user to get the display name for.
	 * @return {string}     The display-friendly name of the user.
	 */
	userName(key) {
		const users = this.listUsers();
		return (users[key]) ? users[key].name : key;
	}
	/**
	 * Gets the client ID of the currently active user for the active organization.
	 *
	 * @return {string} The currently active user ID on the active organization.
	 */
	currentUserId() {
		return this.conf.get(`orgs.${this.currentOrgId()}.currentUser`);
	}
	/**
	 * Gets the currently active user object for the active organization.
	 *
	 * @return {Object} The currently active user object on the active organization.
	 */
	currentUser() {
		return this.conf.get(`orgs.${this.currentOrgId()}.users.${this.currentUserId()}`);
	}
	/**
	 * Sets the active user for the currently active organization.
	 *
	 * @param  {string} key The client ID of the user to set as active for the organization.
	 * @return {object}     The newly current user object.
	 */
	setCurrentUser(key) {
		const users = this.listUsers();
		if (!users[key]) {
			throw new Error(`A user at ID ${key} is not defined for this organization.`);
		}
		this.conf.set(`orgs.${this.currentOrgId()}.currentUser`, key);
		return this.currentUser();
	}
	/**
	 * Removes a user from the active organization.
	 *
	 * @param  {string} key The client ID of the user to remove from the organization.
	 * @return {bool}       True if the user was successfully removed.
	 */
	removeUser(key) {
		if (key === this.currentUserId()) {
			this.conf.delete(`orgs.${this.currentOrgId()}.currentUser`);
		}
		this.conf.delete(`orgs.${this.currentOrgId()}.users.${key}`);
		return true;
	}
	/**
	 * Gets a list of friend available on the currently active organization.
	 *
	 * @return {Object} The available friend on this organization, keyed by client ID.
	 */
	listFriends() {
		return this.conf.get(`orgs.${this.currentOrgId()}.friends`, {});
	}
	/**
	 * Like listFriends, except it lists as a set of key value pairs for options.
	 *
	 * @return {Object} A lit of key: name pairs for use as selectable options.
	 */
	friendOptions() {
		return _.toPairs(this.listFriends()).map(f => ({ name: f[1].name, value: f[0] }));
	}
	/**
	 * Get a display friendly name for a friend.
	 *
	 * @param  {string} key The key of the friend to get the display name for.
	 * @return {string}     The display-friendly name of the friend.
	 */
	friendName(key) {
		const friends = this.listFriends();
		return (friends[key]) ? friends[key].name : key;
	}
	/**
	 * Checks if a friend has been shared with before.
	 *
	 * @param  {string} key  The key of the friend to check.
	 * @param  {string} ukey The user key to check if a friend has beeen shared with.
	 * @return {string}      Whether or not the friend has been shared with perviously.
	 */
	haveSharedWithFriend(key) {
		const friends = this.listFriends();
		return (friends[key]) ? friends[key].shared.includes(this.currentUserId()) : false;
	}
	/**
	 * Set a lock indicating a friend has been previously shared with.
	 *
	 * @param  {string} key  The key of the friend to share with.
	 * @param  {string} ukey The user key to mark as shared with.
	 * @return {string}      Whether or not the lock was added.
	 */
	shareWithFriend(key) {
		const friend = this.listFriends()[key];
		// Make sure the friend exists.
		if (!friend) {
			throw new Error('cannot share with a non-existent friend.');
		}
		// If this friend was shared with before, just return true.
		if (this.haveSharedWithFriend(key, this.currentUserId())) {
			return true;
		}
		// Update the friend with the new lock.
		const updatedFriend = {
			name: friend.name,
			key: friend.key,
			shared: friend.shared.concat([this.currentUserId()]),
		};
		this.conf.set(`orgs.${this.currentOrgId()}.friends.${friend.key}`, updatedFriend);
		return true;
	}
	/**
	 * Adds a friend to the available friends for the active organization.
	 *
	 * @param  {Object} friend The new friend object with name and key.
	 * @return {string}        The nickname of the friend added to the friends list.
	 */
	addFriend(friend) {
		const existingFriend = this.conf.get(`orgs.${this.currentOrgId()}.friends.${friend.key}`);
		if (existingFriend) {
			throw new Error(`The friend ${existingFriend} already exsists at ID ${friend.key} on this organization.`);
		}
		const whitelistedFriend = {
			key: friend.key,
			name: friend.name,
			shared: [],
		};
		this.conf.set(`orgs.${this.currentOrgId()}.friends.${friend.key}`, whitelistedFriend);
		return Object.assign({}, whitelistedFriend);
	}
	/**
	 * Removes a friend from the currently active organization.
	 *
	 * @param  {string} key The client ID of the friend to remove from this organization.
	 * @return {bool}       True if the friend was removed.
	 */
	removeFriend(key) {
		this.conf.delete(`orgs.${this.currentOrgId()}.friends.${key}`);
		return true;
	}
}

module.exports = E3DBConfiguration;
