import config from 'config';

import BaseWatcher from './BaseWatcher';

/**
 * This watcher checks for people asking for support in non support channels.
 *
 * @class SupportRuleWatcher
 * @extends {BaseWatcher}
 */
class SupportRuleWatcher extends BaseWatcher {
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
     * @memberof SupportRuleWatcher
     */
    method = ['message', 'messageUpdate'];

    /**
     * The strings that this watcher should remove.
     *
     * @type {string[]}
     * @memberof SupportRuleWatcher
     */
    strings = ['paste.atlauncher.com', 'USERSDIR\\Instances', 'USERSDIR/Instances'];

    /**
     * The function that should be called when the event is fired.
     *
     * @param {string} method
     * @param {Message} message
     * @param {Message} updatedMessage
     * @memberof SupportRuleWatcher
     */
    async action(method, message, updatedMessage) {
        let messageToActUpon = message;

        if (method === 'messageUpdate') {
            messageToActUpon = updatedMessage;
        }

        const supportChannel = this.bot.channels.find(({ name }) => name === config.get('bot.support_channel'));
        const nonSupportChannels = this.bot.channels.filter(({ name }) =>
            config.get('bot.non_support_channels').includes(name),
        );

        const cleanMessage = messageToActUpon.cleanContent.toLowerCase();

        if (this.strings.some(string => cleanMessage.includes(string))) {
            if (nonSupportChannels.some(({ name }) => name === messageToActUpon.channel.name)) {
                const warningMessage = await messageToActUpon.reply(
                    `It looks like you're asking for support. Please use ${supportChannel} for launcher/pack issues.`,
                );

                this.addWarningToUser(messageToActUpon);

                messageToActUpon.delete();
                warningMessage.delete(60000);
            }
        }
    }
}

export default SupportRuleWatcher;
