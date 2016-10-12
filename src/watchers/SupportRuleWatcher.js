import BaseWatcher from './BaseWatcher';

import config from '../config';

/**
 * This checks for people asking for support in non support channels.
 */
class SupportRoleWatcher extends BaseWatcher {
    constructor(bot) {
        super(bot);
    }

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

        const supportChannel = this.bot.channels.find((channel) => (channel.name === config.support_channel));
        const nonSupportChannels = this.bot.channels.filter((channel) => (config.non_support_channels.indexOf(channel.name) !== -1));

        if (message.content.indexOf('paste.atlauncher.com') !== -1 && nonSupportChannels.exists('name', message.channel.name)) {
            const warningMessage = await message.reply(`It looks like you're asking for support. Please make sure all launcher/pack issues are posted in ${supportChannel}`);

            message.delete();
            warningMessage.delete(60000);
        }
    }
}

export default SupportRoleWatcher;