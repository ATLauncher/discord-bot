import BaseWatcher from './BaseWatcher';

/**
 * This checks for people spamming links.
 */
class PollWatcher extends BaseWatcher {
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

        const cleanMessage = message.cleanContent.toLowerCase();

        if (
            cleanMessage.indexOf('strawpoll.me') !== -1
        ) {
            const rulesChannel = this.bot.channels.find((channel) => (channel.name === config.rules_channel));

            const warningMessage = await message.reply(`Please read the ${rulesChannel}. Polls are not allowed without permission.`);

            this.addWarningToUser(message);

            message.delete();
            warningMessage.delete(60000);
        }
    }
}

export default PollWatcher;