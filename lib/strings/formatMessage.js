/**
 * Formats a message for display.
 */

module.exports = (message, store) => `
Message ID: ${message.key}
Shared By: ${store.conf.friendName(message.author)}
Title: ${message.title}

${message.message}`;
