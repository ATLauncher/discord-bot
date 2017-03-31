import BaseWatcher from './BaseWatcher';

import config from '../config';

/**
 * This checks for people using @here and @everyone.
 */
class TagRuleWatcher extends BaseWatcher {
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
            message.mentions.everyone ||
            message.cleanContent.indexOf('@everyone') !== -1 ||
            message.cleanContent.indexOf('@here') !== -1 ||
            message.cleanContent.indexOf('@all') !== -1 ||
            message.content.indexOf('@everyone') !== -1 ||
            message.content.indexOf('@here') !== -1 ||
            message.content.indexOf('@all') !== -1
        ) {
            const warningMessage = await message.reply(`Please read the ${rulesChannel} channel. Use of tags such as \`@everyone\` and \`@here\` are not allowed.`);

            this.addWarningToUser(message);

            message.delete();
            warningMessage.delete(60000);
        }
    }
}

export default TagRuleWatcher;