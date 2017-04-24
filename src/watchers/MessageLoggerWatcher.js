import BaseWatcher from './BaseWatcher';

import * as database from '../db';

class MessageLoggerWatcher extends BaseWatcher {
    /**
     * The priority of this watcher. The lower the number the first it will be to run.
     *
     * @type {number}
     */
    priority = -20;

    /**
     * The method this watcher should listen on.
     *
     * @type {string[]}
     */
    method = [
        'message',
        'messageDelete',
        'messageUpdate'
    ];

    /**
     * If this watcher should be run or not.
     *
     * @returns {boolean}
     */
    shouldRun() {
        return true;
    }

    action(method, message, updatedMessage) {
        let messageToActUpon = message;

        if (method === 'messageUpdate') {
            messageToActUpon = updatedMessage;
        }

        const messageToLog = {
            id: messageToActUpon.id,
            userID: messageToActUpon.author.id,
            isSystemMessage: messageToActUpon.system,
            isBotMessage: messageToActUpon.author.bot,
            content: messageToActUpon.cleanContent,
            channel: {
                id: messageToActUpon.channel.id,
                name: messageToActUpon.channel.name
            },
            user: {
                id: messageToActUpon.author.id,
                username: messageToActUpon.author.username,
                discriminator: messageToActUpon.author.discriminator
            },
            timestamp: new Date().toISOString(),
            deletedAt: (method === 'messageDelete') ? new Date().toISOString() : null
        };

        try {
            database.updateMessageByID(messageToLog.id, messageToLog);
        } catch (e) {
        }
    }
}

export default MessageLoggerWatcher;
