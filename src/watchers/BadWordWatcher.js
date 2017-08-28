import BaseWatcher from './BaseWatcher';

import config from '../config';

/**
 * This watcher checks for people saying bad words.
 *
 * @class BadWordWatcher
 * @extends {BaseWatcher}
 */
class BadWordWatcher extends BaseWatcher {
    /**
     * If this watcher uses bypass rules.
     *
     * @type {boolean}
     * @memberof BadWordWatcher
     */
    usesBypassRules = false;

    /**
     * The method this watcher should listen on.
     *
     * @type {string|string[]}
     * @memberof BadWordWatcher
     */
    method = ['message', 'messageUpdate'];

    /**
     * Run the watcher with the given parameters.
     *
     * @param {string} method
     * @param {Message} message
     * @param {Message} updatedMessage
     * @memberof BadWordWatcher
     */
    async action(method, message, updatedMessage) {
        let messageToActUpon = message;

        if (method === 'messageUpdate') {
            messageToActUpon = updatedMessage;
        }

        const rulesChannel = this.bot.channels.find((channel) => {
            return channel.name === config.rules_channel;
        });

        const cleanMessage = messageToActUpon.cleanContent.toLowerCase();
        const messageParts = cleanMessage.includes(' ') ? cleanMessage.split(' ') : [cleanMessage];

        const containsBadWord = messageParts.some((word) => {
            return config.bad_words.includes(word);
        });

        if (containsBadWord) {
            const warningMessage = await messageToActUpon.reply(
                `Please read the ${rulesChannel} channel. Spamming or encouraging spamming is not allowed.`
            );

            this.addWarningToUser(messageToActUpon);

            messageToActUpon.delete();

            warningMessage.delete(60000);
        }
    }
}

export default BadWordWatcher;
