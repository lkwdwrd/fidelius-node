/**
 * The printable object for passing messages around the application.
 */

'use strict';

// Import dependencies
const assert = require('assert');

/**
 * An object intended to be printed out.
 */
class Printable {
	/**
	 * An object intended to be printed statefully.
	 *
	 * A printable represents a type of message, and then the message text. This
	 * allows parts of the application to send printable messages to a some kind
	 * of output mechanism. What this mechanism is doesn't matter, this just
	 * provides a structure for the kinds of messages a printer can expect.
	 *
	 * Message can also be an array of Printables. If this is the case the type
	 * should be set to 'print'.
	 *
	 * @param {string}                  type    The type of message to be printed.
	 * @param {string|Array<Printable>} message The message to prin.
	 */
	constructor(type, message) {
		this.type = type;
		this.message = message;
	}
	/**
	 * A getter ro the message type.
	 *
	 * @return string The type of message, whitelisted.
	 */
	get type() {
		return this.whitelistedType;
	}
	/**
	 * A setter for the message type.
	 *
	 * Doing this with a setter allows only the specfic whitelist of types to
	 * be available in a printable. This way a printer can know what to expect
	 * in terms of processing the various type of messages.
	 *
	 * Print: This printable contains other printables.
	 * Confirm: This message confirms something with the user.
	 * Success: This message informs the user an operation was successful.
	 * Warning: This message warns a user of potential consquences.
	 * Error: This message informs the user an error occured.
	 * Raw: This message has no specific context and will print directly.
	 *
	 * @param {string} val The message type, must be from the specific types.
	 * @return {void}
	 */
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
