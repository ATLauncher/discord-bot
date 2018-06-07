import BaseWatcher from './BaseWatcher';

import config from '../config';

/**
 * This watcher checks for people using bad tags such as @here, @all and @everyone.
 *
 * @class TagRuleWatcher
 * @extends {BaseWatcher}
 */
class TagRuleWatcher extends BaseWatcher {
    /**
     * If this watcher uses bypass rules.
     *
     * @type {boolean}
     * @memberof TagRuleWatcher
     */
    usesBypassRules = true;

    /**
     * The method this watcher should listen on.
     *
     * @type {string|string[]}
     * @memberof TagRuleWatcher
     */
    method = ['message', 'messageUpdate'];

    /**
     * The function that should be called when the event is fired.
     *
     * @param {string} method
     * @param {Message} message
     * @param {Message} updatedMessage
     * @memberof TagRuleWatcher
     */
    async action(method, message, updatedMessage) {
        let messageToActUpon = message;

        if (method === 'messageUpdate') {
            messageToActUpon = updatedMessage;
        }

        const rulesChannel = this.bot.channels.find((channel) => {
            return channel.name === config.rules_channel;
        });

        if (
            messageToActUpon.cleanContent.toLowerCase().includes('@everyone') ||
            messageToActUpon.cleanContent.toLowerCase().includes('@here')
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
