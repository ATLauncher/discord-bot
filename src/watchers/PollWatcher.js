import config from 'config';

import BaseWatcher from './BaseWatcher';

/**
 * This watcher checks for people spamming links.
 *
 * @class PollWatcher
 * @extends {BaseWatcher}
 */
class PollWatcher extends BaseWatcher {
    /**
     * If this watcher uses bypass rules.
     *
     * @type {boolean}
     * @memberof PollWatcher
     */
    usesBypassRules = true;

    /**
     * The method this watcher should listen on.
     *
     * @type {string|string[]}
     * @memberof PollWatcher
     */
    method = ['message', 'messageUpdate'];

    /**
     * The function that should be called when the event is fired.
     *
     * @param {string} method
     * @param {Message} message
     * @param {Message} updatedMessage
     * @memberof PollWatcher
     */
    async action(method, message, updatedMessage) {
        let messageToActUpon = message;

        if (method === 'messageUpdate') {
            messageToActUpon = updatedMessage;
        }

        const cleanMessage = messageToActUpon.cleanContent.toLowerCase();

        if (
            cleanMessage.toLowerCase().includes('strawpoll.me') ||
            cleanMessage.toLowerCase().includes('strawpoll.com')
        ) {
            const rulesChannel = this.bot.channels.find(channel => channel.name === config.get('bot.rules_channel'));

            const warningMessage = await messageToActUpon.reply(
                `Please read the ${rulesChannel}. Polls are not allowed without permission.`,
            );

            this.addWarningToUser(messageToActUpon);

            messageToActUpon.delete();
            warningMessage.delete(60000);
        }
    }
}

export default PollWatcher;
