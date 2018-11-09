import BaseWatcher from './BaseWatcher';

import config from '../config';

/**
 * This watcher checks for people asking for support in non support channels.
 *
 * @class SupportRoleWatcher
 * @extends {BaseWatcher}
 */
class SupportRoleWatcher extends BaseWatcher {
    /**
     * The method this watcher should listen on.
     *
     * @type {string|string[]}
     * @memberof SupportRuleWatcher
     */
    method = ['message', 'messageUpdate'];

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

        const supportChannel = this.bot.channels.find(({ name }) => name === config.support_channel);
        const nonSupportChannels = this.bot.channels.filter(({ name }) => config.non_support_channels.includes(name));

        if (
            messageToActUpon.cleanContent.toLowerCase().includes('paste.atlauncher.com') ||
            messageToActUpon.cleanContent.toLowerCase().includes('USERSDIR\\Instances') ||
            messageToActUpon.cleanContent.toLowerCase().includes('USERSDIR/Instances')
        ) {
            if (nonSupportChannels.some(({ name }) => name === messageToActUpon.channel.name)) {
                const warningMessage = await messageToActUpon.reply(
                    `It looks like you're asking for support. Please use ${supportChannel} for launcher/pack issues.`
                );

                this.addWarningToUser(messageToActUpon);

                messageToActUpon.delete();
                warningMessage.delete(60000);
            }
        }
    }
}

export default SupportRoleWatcher;
