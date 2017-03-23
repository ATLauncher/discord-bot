import BaseWatcher from './BaseWatcher';

import config from '../config';

/**
 * This checks for people using self bots.
 */
class SelfBotWatcher extends BaseWatcher {
    constructor(bot) {
        super(bot);
    }

    usesBypassRules = true;

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

        const rulesChannel = this.bot.channels.find((channel) => (channel.name === config.rules_channel));

        const cleanMessage = message.cleanContent.toLowerCase();

        if (cleanMessage.indexOf('self.') === 0) {
            const warningMessage = await message.reply(`Please read the ${rulesChannel} channel. Bots are not allowed without permission.`);

            this.addWarningToUser(message);

            message.delete();
            warningMessage.delete(60000);
        }
    }
}

export default SelfBotWatcher;