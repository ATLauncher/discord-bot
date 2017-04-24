import BaseWatcher from './BaseWatcher';

import config from '../config';

/**
 * This checks for people using self bots.
 */
class SelfBotWatcher extends BaseWatcher {
    usesBypassRules = true;

    /**
     * The method this watcher should listen on.
     *
     * @type {string[]}
     */
    method = [
        'message',
        'messageUpdate'
    ];

    async action(method, message, updatedMessage) {
        let messageToActUpon = message;

        if (method === 'messageUpdate') {
            messageToActUpon = updatedMessage;
        }

        const rulesChannel = this.bot.channels.find((channel) => (channel.name === config.rules_channel));

        const cleanMessage = messageToActUpon.cleanContent.toLowerCase();

        if (cleanMessage.indexOf('self.') === 0) {
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
