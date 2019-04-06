import config from 'config';

import BaseWatcher from './BaseWatcher';

/**
 * This watcher checks for people using self bots.
 *
 * @class SelfBotWatcher
 * @extends {BaseWatcher}
 */
class SelfBotWatcher extends BaseWatcher {
    /**
     * If this watcher uses bypass rules.
     *
     * @type {boolean}
     * @memberof SelfBotWatcher
     */
    usesBypassRules = true;

    /**
     * The method this watcher should listen on.
     *
     * @type {string|string[]}
     * @memberof SelfBotWatcher
     */
    method = ['message', 'messageUpdate'];

    /**
     * The function that should be called when the event is fired.
     *
     * @param {string} method
     * @param {Message} message
     * @param {Message} updatedMessage
     * @memberof SelfBotWatcher
     */
    async action(method, message, updatedMessage) {
        let messageToActUpon = message;

        if (method === 'messageUpdate') {
            messageToActUpon = updatedMessage;
        }

        const rulesChannel = this.bot.channels.find((channel) => channel.name === config.get('bot.rules_channel'));

        const cleanMessage = messageToActUpon.cleanContent.toLowerCase();

        if (cleanMessage.toLowerCase().startsWith('self.')) {
            const warningMessage = await messageToActUpon.reply(
                `Please read the ${rulesChannel} channel. Bots are not allowed without permission.`
            );

            this.addWarningToUser(messageToActUpon);

            messageToActUpon.delete();
            warningMessage.delete(60000);
        }
    }
}

export default SelfBotWatcher;
