import BaseWatcher from './BaseWatcher';

import * as database from '../db';

/**
 * This checks for people spamming the same message multiple times.
 *
 * It will trigger when the same message is sent 3 times within 30 seconds.
 */
class SameMessageSpamWatcher extends BaseWatcher {
    constructor(bot) {
        super(bot);
    }

    usesBypassRules = true;

    shouldRunOnBots = false;

    /**
     * The method this watcher should listen on.
     *
     * @type {string}
     */
    method = [
        'message',
        'messageUpdate'
    ];

    async action(method, message, updatedMessage) {
        if (method === 'messageUpdate') {
            message = updatedMessage;
        }

        if (!this.isAModeratedChannel(message.channel.name)) {
            return;
        }

        const count = await database.countMessagesInLast(message.cleanContent, 30);

        if (count >= 3) {
            const warningMessage = await message.reply(`Please do not spam the same message.`);

            this.addWarningToUser(message);

            message.delete();
            warningMessage.delete(60000);
        }
    }
}

export default SameMessageSpamWatcher;