/**
 * The concret DB connection for working with e3db.
 */

// Import Dependencies
const DBConnection = require('../../interfaces/DBConnection');
const Message = require('../../Message');
const e3db = require('e3db');
const assert = require('assert');

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
	constructor(conf, db = e3db) {
		super(conf);
		this.e3db = db;
	}
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
	async share(key) {
		return this.getClient().share(key, key);
	}
	unshare(key) {
		return this.getClient().revoke(key, key);
	}
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
			return record;
		} catch (e) {
			throw e;
		}
	}
	async readMessage(id) {
		try {
			const client = this.getClient();
			const record = await client.read(id);
			return recordToMessage(record);
		} catch (e) {
			throw e;
		}
	}
	async deleteMessage(id) {
		try {
			const client = this.getClient();
			const success = await client.delete(id);
			return success;
		} catch (e) {
			throw e;
		}
	}
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
	listUserMessages() {
		return this.listMessages({ writer: this.conf.currentUserId() });
	}
	listSharedMessages() {
		return this.listMessages({ writer: 'all', type: this.conf.currentUserId() });
	}
}

module.exports = E3DBConnection;
