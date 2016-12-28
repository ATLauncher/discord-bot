import BaseWatcher from './BaseWatcher';

import config from '../config';

/**
 * This checks for people spamming copy and past 'dont add this hacker' crap.
 */
class DaviesSpamWatcher extends BaseWatcher {
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

        if ((message.cleanContent.toLowerCase().indexOf('chrisopeer davies') !== -1) || (message.cleanContent.toLowerCase().indexOf('jessica davies') !== -1)) {
            const warningMessage = await message.reply(`Please read the ${rulesChannel} channel. Spamming or encouraging spamming is not allowed.`);

            this.addWarningToUser(message);

            message.delete();
            warningMessage.delete(60000);
        }
    }
}

export default DaviesSpamWatcher;