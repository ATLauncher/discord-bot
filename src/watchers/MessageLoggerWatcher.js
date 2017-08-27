import BaseWatcher from './BaseWatcher';

import * as database from '../db';

/**
 * This watcher logs all messages made, updated or deleted in the database.
 *
 * @class MessageLoggerWatcher
 * @extends {BaseWatcher}
 */
class MessageLoggerWatcher extends BaseWatcher {
    /**
     * The priority of this watcher. The lower the number the first it will be to run.
     *
     * @type {number}
     * @memberof MessageLoggerWatcher
     */
    priority = -20;

    /**
     * The method this watcher should listen on.
     *
     * @type {string|string[]}
     * @memberof MessageLoggerWatcher
     */
    method = ['message', 'messageDelete', 'messageUpdate'];

    /**
     * If this watcher should be run or not.
     *
     * @returns {boolean}
     * @memberof MessageLoggerWatcher
     */
    shouldRun() {
        return true;
    }

    /**
     * The function that should be called when the event is fired.
     *
     * @param {string} method
     * @param {Message} message
     * @param {Message} updatedMessage
     * @memberof MessageLoggerWatcher
     */
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
                name: messageToActUpon.channel.name,
            },
            user: {
                id: messageToActUpon.author.id,
                username: messageToActUpon.author.username,
                discriminator: messageToActUpon.author.discriminator,
            },
            timestamp: new Date().toISOString(),
            deletedAt: method === 'messageDelete' ? new Date().toISOString() : null,
        };

        try {
            database.updateMessageByID(messageToLog.id, messageToLog);
        } catch (e) {}
    }
}

export default MessageLoggerWatcher;
