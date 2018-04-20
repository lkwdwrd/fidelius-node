/**
 * Defines the message object to ensure it it standardized in the application.
 */

/**
 * A basic class defining what a message object should look like.
 */
class Message {
	/**
	 * The message object constructor, setting initial data.
	 *
	 * @param  {string}  key     The key for the message in the database.
	 * @param  {string}  title   The title of the message.
	 * @param  {string}  message The message text.
	 * @param  {string}  author  The message author's key.
	 * @return {Message}         The constructed Message object.
	 */
	constructor(key, title, message, author) {
		this.key = key;
		this.message = message;
		this.title = title;
		this.author = author;
	}
}

module.exports = Message;
