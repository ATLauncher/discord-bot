import BaseWatcher from './BaseWatcher';

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

    action(method, message) {
        console.log(method, message);
        // don't log deletion of bot messages
        if (message.author.bot) {
            console.log(message);
            return false;
        }

        const moderatorChannel = this.getModerationLogsChannel();

        if (moderatorChannel) {
            moderatorChannel.sendMessage(`**User:** ${message.author} (${message.author.username}#${message.author.discriminator})\n**Action:** message removed\n**Channel:** ${message.channel}\n**Message:**\`\`\`${message.cleanContent}\`\`\``)
        }
    }
}

export default DeleteWatcher;