class DBConnection {
	constructor(conf) {
		this.conf = conf;
	}
	register() {}
	createMessage() {}
	readMessage() {}
	deleteMessage() {}
	listMessages() {}
	listUserMessages() {}
	istSharedMessages() {}
}

module.exports = DBConnection;
