/**
 * Formats a message for display.
 */

'use strict';

/**
 * Format a message object into a string for printing.
 *
 * @param  {Message} message A message object to format.
 * @param  {Store}   store   The store object with the input and output objects.
 * @return {string}          The formatted message text.
 */
module.exports = (message, store) => `
Message ID: ${message.key}
Shared By: ${store.conf.friendName(message.author)}
Title: ${message.title}

${message.message}`;
