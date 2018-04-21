/**
 * The database connection interface.
 *
 * This is the main storage device for fidelius.
 */

// We'll define but not use the arguments in the interface.
/* eslint-disable no-unused-vars */

/**
 * The DB connetion interface classs.
 */
class DBConnection {
	/**
	 * Sets up the DB connection based on the current configuration.
	 *
	 * @param {Configuration} conf The configuration object for the DB strategy.
	 */
	constructor(conf) {
		this.conf = conf;
	}
	/**
	 * Allows registration of a user account with an organization.
	 *
	 * @param  {object} info The info object gathered before registration.
	 * @return {object}      The full registration object for config storage.
	 */
	register(info) {
		throw new Error('DBConnection classes must have a register method');
	}
	/**
	 * Allows a user to create a message and share it with a friend.
	 *
	 * @param  {string}  message The message to share.
	 * @param  {string}  title   The title of the message.
	 * @param  {string}  friend  The key of the friend to share the message with.
	 * @return {Message}         The created message object.
	 */
	createMessage(message, title, friend) {
		throw new Error('DBConnection classes must have a createMessage method');
	}
	/**
	 * Allows a user to read a message shared with them.
	 *
	 * @param  {string}  key The key of the message to read.
	 * @return {Message}     The message object fetched from the database.
	 */
	readMessage(key) {
		throw new Error('DBConnection classes must have a readMessage method');
	}
	/**
	 * Allows a user to delete a message.
	 *
	 * @param  {string}  key The key of the message to delete.
	 * @return {boolean}     True if the mssage was deleted.
	 */
	deleteMessage() {
		throw new Error('DBConnection classes must have a deleteMessage method');
	}
	/**
	 * List messages in the database created by the current user.
	 *
	 * @return {Array.<Message>} The messages created by the current user.
	 */
	listUserMessages() {
		throw new Error('DBConnection classes must have a listUserMessages method');
	}
	/**
	 * List message in the database shared with the current user.
	 *
	 * @return {Array.<Message>} The messages shared with the current user.
	 */
	listSharedMessages() {
		throw new Error('DBConnection classes must have a listSharedMessages method');
	}
}

module.exports = DBConnection;
