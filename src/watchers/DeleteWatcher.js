import BaseWatcher from './BaseWatcher';

import config from '../config';

class DeleteWatcher extends BaseWatcher {
    constructor(bot) {
        super(bot);
    }

    /**
     * The method this watcher should listen on.
     *
     * @type {string}
     */
    method = 'messageDelete';

    action(message) {
        if (message.system) {
            return false; // don't match system messages
        }

        if (message.author.bot) {
            return false; // don't respond to bot users
        }

        const moderatorChannel = this.bot.channels.find((channel) => (channel.name === config.moderator_channel));

        if (moderatorChannel) {
            moderatorChannel.sendMessage(`**User:** ${message.author} (${message.author.username}#${message.author.discriminator})\n**Action:** message removed\n**Channel:** #${message.channel.name}\n**Message:**\`\`\`${message.cleanContent}\`\`\``)
        }
    }
}

export default DeleteWatcher;