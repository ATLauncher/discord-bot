import BaseWatcher from './BaseWatcher';

import * as database from '../db';

class MessageLoggerWatcher extends BaseWatcher {
    constructor(bot) {
        super(bot);
    }

    /**
     * The priority of this watcher. The lower the number the first it will be to run.
     *
     * @type {number}
     */
    priority = -20;

    /**
     * The method this watcher should listen on.
     *
     * @type {string|string[]}
     */
    method = [
        'message',
        'messageDelete',
        'messageUpdate'
    ];

    shouldRun() {
        return true;
    }

    async action(method, message, updatedMessage) {
        if (method === 'messageUpdate') {
            message = updatedMessage;
        }

        const messageToLog = {
            id: message.id,
            userID: message.author.id,
            isSystemMessage: message.system,
            isBotMessage: message.author.bot,
            content: message.cleanContent,
            channel: {
                id: message.channel.id,
                name: message.channel.name
            },
            user: {
                id: message.author.id,
                username: message.author.username,
                discriminator: message.author.discriminator
            },
            timestamp: new Date().toISOString(),
            deletedAt: (method === 'messageDelete') ? new Date().toISOString() : null
        };

        try {
            database.updateMessageByID(messageToLog.id, messageToLog);
        } catch (e) {
            console.error(e);
        }
    }
}

export default MessageLoggerWatcher;