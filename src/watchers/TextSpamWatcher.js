import BaseWatcher from './BaseWatcher';

import config from '../config';

/**
 * This checks for people spamming text stuff.
 */
class TextSpamWatcher extends BaseWatcher {
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

        if (
            cleanMessage.indexOf('this is cooldog') !== -1 ||
            cleanMessage.indexOf('this is memedog') !== -1 ||
            cleanMessage.indexOf('chrisopeer davies') !== -1 ||
            cleanMessage.indexOf('jessica davies') !== -1 ||
            cleanMessage.indexOf('DMing inappropriate photos of underage children') !== -1 ||
            cleanMessage.indexOf('bots are joining servers and sending mass') !== -1
        ) {
            const warningMessage = await message.reply(`Please read the ${rulesChannel} channel. Spamming or encouraging spamming is not allowed.`);

            this.addWarningToUser(message);

            message.delete();
            warningMessage.delete(60000);
        }
    }
}

export default TextSpamWatcher;