import BaseWatcher from './BaseWatcher';

import config from '../config';

/**
 * This checks for people asking for support in non support channels.
 */
class SupportRoleWatcher extends BaseWatcher {
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

        const supportChannel = this.bot.channels.find((channel) => (channel.name === config.support_channel));
        const nonSupportChannels = this.bot.channels.filter((channel) => (
            config.non_support_channels.indexOf(channel.name) !== -1)
        );

        const cleanMessage = messageToActUpon.cleanContent.toLowerCase();

        if (
            cleanMessage.indexOf('paste.atlauncher.com') !== -1 ||
            cleanMessage.indexOf('USERSDIR\\Instances') !== -1 ||
            cleanMessage.indexOf('USERSDIR/Instances') !== -1
        ) {
            if (nonSupportChannels.exists('name', messageToActUpon.channel.name)) {
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
