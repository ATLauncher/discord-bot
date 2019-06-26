import BaseWatcher from './BaseWatcher';

import * as database from '../db';

/**
 * This watcher checks for people spamming the same message multiple times.
 *
 * It will trigger when the same message is sent 3 times within 30 seconds.
 *
 * @class SameMessageSpamWatcher
 * @extends {BaseWatcher}
 */
class SameMessageSpamWatcher extends BaseWatcher {
    /**
     * If this watcher should run on bots or not.
     *
     * @type {boolean}
     * @memberof SameMessageSpamWatcher
     */
    shouldRunOnBots = false;

    /**
     * If this watcher uses bypass rules.
     *
     * @type {boolean}
     * @memberof SameMessageSpamWatcher
     */
    usesBypassRules = true;

    /**
     * The method this watcher should listen on.
     *
     * @type {string|string[]}
     * @memberof SameMessageSpamWatcher
     */
    method = ['message', 'messageUpdate'];

    /**
     * The function that should be called when the event is fired.
     *
     * @param {string} method
     * @param {Message} message
     * @param {Message} updatedMessage
     * @memberof SameMessageSpamWatcher
     */
    async action(method, message, updatedMessage) {
        let messageToActUpon = message;

        if (method === 'messageUpdate') {
            messageToActUpon = updatedMessage;
        }

        if (!this.isAModeratedChannel(messageToActUpon.channel.name)) {
            return;
        }

        const count = await database.countMessagesInLast(messageToActUpon.cleanContent, 30);

        if (count >= 3) {
            const warningMessage = await messageToActUpon.reply('Please do not spam the same message.');

            this.addWarningToUser(messageToActUpon);

            messageToActUpon.delete();
            warningMessage.delete(60000);
        }
    }
}

export default SameMessageSpamWatcher;
