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

    shouldRun(method, message) {
        if (!super.shouldRun(method, message)) {
            return false;
        }

        // don't log deletion of bot messages
        if (message.author.bot) {
            return false;
        }

        return true;
    }

    action(method, message) {
        const messageToSend = `**User:** ${message.author} (${message.author.username}#${message.author.discriminator})\n**Action:** message removed\n**Channel:** ${message.channel}\n**Message:**\`\`\`${message.cleanContent}\`\`\``;

        this.sendMessageToModeratorLogsChannel(messageToSend);
    }
}

export default DeleteWatcher;