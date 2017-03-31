import BaseWatcher from './BaseWatcher';

class DeleteWatcher extends BaseWatcher {
    constructor(bot) {
        super(bot);
    }

    /**
     * The method this watcher should listen on.
     *
     * @type {string[]}
     */
    method = [
        'messageDelete',
        'messageDeleteBulk'
    ];

    shouldRun(method, message) {
        if (!super.shouldRun(method, message)) {
            return false;
        }

        // don't log deletion of bot messages
        if (message.author && message.author.bot) {
            return false;
        }

        return true;
    }

    action(method, message) {
        // check if we're getting a collection of messages or not
        if (method === 'messageDeleteBulk') {
            message.forEach((value) => {
                this.logMessage(value)
            });
        } else {
            this.logMessage(message);
        }
    }

    logMessage(message) {
        if (
            message.cleanContent.substr(0, 4) === '!cyt' ||
            message.cleanContent.substr(0, 5) === '!logs' ||
            message.cleanContent.substr(0, 7) === '!idbans' ||
            message.cleanContent.substr(0, 8) === '!working'
        ) {
            return;
        }

        let messageParts = [];

        if (!message.author) {
            messageParts.push('**User:** Unknown');
        } else {
            messageParts.push(`**User:** ${message.author} (${message.author.username}#${message.author.discriminator})`);
        }

        messageParts.push('**Action:** message removed');
        messageParts.push(`**Channel:** ${message.channel}`);
        messageParts.push(`**Message:**\`\`\`${message.cleanContent}\`\`\``);

        this.sendMessageToModeratorLogsChannel(messageParts.join("\n"));
    }
}

export default DeleteWatcher;