import BaseWatcher from './BaseWatcher';

import config from '../config';

/**
 * This checks for people using @here and @everyone.
 */
class TagRuleWatcher extends BaseWatcher {
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

        if (
            messageToActUpon.mentions.everyone ||
            messageToActUpon.cleanContent.indexOf('@everyone') !== -1 ||
            messageToActUpon.cleanContent.indexOf('@here') !== -1 ||
            messageToActUpon.cleanContent.indexOf('@all') !== -1 ||
            messageToActUpon.content.indexOf('@everyone') !== -1 ||
            messageToActUpon.content.indexOf('@here') !== -1 ||
            messageToActUpon.content.indexOf('@all') !== -1
        ) {
            const warningMessage = await messageToActUpon.reply(
                `Please read the ${rulesChannel} channel. Tags such as \`@everyone\` and \`@here\` are not allowed.`
            );

            this.addWarningToUser(messageToActUpon);

            messageToActUpon.delete();
            warningMessage.delete(60000);
        }
    }
}

export default TagRuleWatcher;
