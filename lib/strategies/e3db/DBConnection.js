/**
 * The concret DB connection for working with e3db.
 */

// Import Dependencies
const DBConnection = require('../../interfaces/DBConnection');
const Message = require('../../Message');
const e3db = require('e3db');
const assert = require('assert');

/**
 * Converts an e3db record object to a Fidelius Message object.
 *
 * @param  {Record} record The database record object
 * @return {Message}       The message object from the e3db record.
 */
const recordToMessage = record => new Message(
	record.meta.recordId,
	record.meta.plain.title,
	record.data ? record.data.message : '',
	record.meta.writerId,
	record.meta.type,
);

/**
 * The helper connection class of interacting with e3db.
 */
class E3DBConnection extends DBConnection {
	/**
	 * Creates the DB connection adapter for e3db.
	 *
	 * @param {Configuration} conf The e3db Configuration object.
	 * @param {object=}       db The object enabling DB access. Default: e3db.
	 */
	constructor(conf, db = e3db) {
		super(conf);
		this.e3db = db;
	}
	/**
	 * Gets a configured e3db client based on the current configured user.
	 *
	 * @return {Client} The e3db client object.
	 */
	getClient() {
		if (!this.activeClient) {
			const user = this.conf.currentUser();
			const config = new this.e3db.Config(
				user.key,
				user.api_key_id,
				user.api_secret,
				user.public_key,
				user.private_key,
				user.api_url,
				user.public_signing_key,
				user.private_signing_key,
			);
			this.activeClient = new this.e3db.Client(config);
		}
		return this.activeClient;
	}
	/**
	 * Allows registration of a user account with an e3db organization.
	 *
	 * @param  {object} info      The infomration gathered to register a user.
	 * @param  {object} info.name The name of the user to add.
	 * @return {object}           The full registration object for config storage.
	 */
	async register({ name }) {
		// get token.
		const token = this.conf.currentOrgId();
		assert(token, 'An organization must be available to register a user.');
		// generate keys and register a new user.
		const [cryptoKeys, signingKeys] = await Promise.all([
			this.e3db.Client.generateKeypair(),
			this.e3db.Client.generateSigningKeypair(),
		]);
		const clientInfo = await this.e3db.Client.register(token, name, cryptoKeys, signingKeys, true);
		// organize data into a user object and return it.
		return {
			name,
			key: clientInfo.clientId,
			public_key: cryptoKeys.publicKey,
			private_key: cryptoKeys.privateKey,
			public_signing_key: signingKeys.publicKey,
			private_signing_key: signingKeys.privateKey,
			api_key_id: clientInfo.apiKeyId,
			api_secret: clientInfo.apiSecret,
		};
	}
	/**
	 * Share messages with a friend by ID.
	 *
	 * @param  {string}  key The key of the friend to share the message with.
	 * @return {boolean}     True if the share was successful.
	 */
	share(key) {
		return this.getClient().share(key, key);
	}
	/**
	 * Stop sharing messages with a friend by ID.
	 *
	 * @param  {string}  key The key of the friend to stop sharing with.
	 * @return {boolean}     True if the unshare was successful.
	 */
	unshare(key) {
		return this.getClient().revoke(key, key);
	}
	/**
	 * Create a new message, store it, and share it with a friend.
	 *
	 * @param {string} message The message text.
	 * @param {string} title   A message title.
	 * @param {string} friend  The key of the friend to share the message with.
	 */
	async createMessage(message, title, friend) {
		try {
			const client = this.getClient();
			const record = await client.write(
				friend,
				{ message },
				{ title, fidelius: 'shared-message' },
			);
			if (!this.conf.haveSharedWithFriend(friend)) {
				await this.share(friend);
				this.conf.shareWithFriend(friend);
			}
			return recordToMessage(record);
		} catch (e) {
			throw e;
		}
	}
	/**
	 * Get a message for reading by message ID key.
	 *
	 * @param {string}   key The meessage key to read.
	 * @return {Message}     A Fidelius Message object.
	 */
	async readMessage(key) {
		try {
			const client = this.getClient();
			const record = await client.read(key);
			return recordToMessage(record);
		} catch (e) {
			throw e;
		}
	}
	/**
	 * Deletes a message from the database by ID key.
	 *
	 * @param  {key}     key The ID key of the message to delete.
	 * @return {boolean}     True if the message was deleted.
	 */
	async deleteMessage(key) {
		try {
			const client = this.getClient();
			const success = await client.delete(key);
			return success;
		} catch (e) {
			throw e;
		}
	}
	/**
	 * Get a listing of messages based on a query.
	 *
	 * @param  {object}         param0        An object with query values.
	 * @param  {string}         param0.writer The writers's clint ID key.
	 * @param  {string}         param0.type   The type of message to search for.
	 * @return {Array<Message>}               An array of messages.
	 */
	async listMessages({ writer, type: type = null } = {}) {
		try {
			const client = this.getClient();
			const records = await client
				.query(false, writer, null, type, { eq: { name: 'fidelius', value: 'shared-message' } })
				.next();
			return records.map(recordToMessage);
		} catch (e) {
			throw e;
		}
	}
	/**
	 * Get and array of messages written by active user.
	 *
	 * @return {Array<Message>} An array of messages written by the current user.
	 */
	listUserMessages() {
		return this.listMessages({ writer: this.conf.currentUserId() });
	}
	/**
	 * Get and array of messages shared with the active user.
	 *
	 * @return {Array<Message>} An array of messages shared with the current user.
	 */
	listSharedMessages() {
		return this.listMessages({ writer: 'all', type: this.conf.currentUserId() });
	}
}

module.exports = E3DBConnection;
