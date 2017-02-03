import BaseWatcher from './BaseWatcher';

import config from '../config';

/**
 * This checks for people spamming cool dog crap.
 */
class CoolDogSpamWatcher extends BaseWatcher {
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

        if (
            message.cleanContent.toLowerCase().indexOf('this is cooldog') !== -1 ||
            message.cleanContent.toLowerCase().indexOf('this is memedog') !== -1
        ) {
            const warningMessage = await message.reply(`Please read the ${rulesChannel} channel. Spamming or encouraging spamming is not allowed.`);

            this.addWarningToUser(message);

            message.delete();
            warningMessage.delete(60000);
        }
    }
}

export default CoolDogSpamWatcher;