/**
 * Gathers all the defined routes and makes them available in an array.
 */

'use strict';

// Import dependencies.
const version = require('./version');
const info = require('./info');
const addOrg = require('./addOrg');
const changeOrg = require('./changeOrg');
const removeOrg = require('./removeOrg');
const addUser = require('./addUser');
const changeUser = require('./changeUser');
const removeUser = require('./removeUser');
const addFriend = require('./addFriend');
const removeFriend = require('./removeFriend');
const newMessage = require('./new');
const listMessages = require('./list');
const readMessage = require('./read');
const exportUser = require('./exportUser');

module.exports = [
	version,
	info,
	addOrg,
	changeOrg,
	removeOrg,
	addUser,
	changeUser,
	removeUser,
	addFriend,
	removeFriend,
	newMessage,
	listMessages,
	readMessage,
	exportUser,
];
