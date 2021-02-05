import * as Discord from 'discord.js';

import BaseWatcher from './BaseWatcher';

import * as database from '../utils/db';

/**
 * This watcher logs all messages made, updated or deleted in the database.
 */
class MessageLoggerWatcher extends BaseWatcher {
    /**
     * The priority of this watcher. The lower the number the first it will be to run.
     */
    priority = -20;

    /**
     * The methods this watcher should listen on.
     */
    methods: Array<keyof Discord.ClientEvents> = ['message', 'messageDelete', 'messageUpdate'];

    /**
     * If this watcher should be run or not.
     */
    async shouldRun(): Promise<boolean> {
        return true;
    }

    /**
     * The function that should be called when the event is fired.
     */
    async action(method: keyof Discord.ClientEvents, ...args: Discord.ClientEvents['message' | 'messageUpdate']) {
        const message = args[1] || args[0];

        if (message.cleanContent && message.author && message.channel instanceof Discord.TextChannel) {
            const messageToLog = {
                id: message.id,
                userID: message.author.id,
                isSystemMessage: message.system ?? false,
                isBotMessage: message.author.bot,
                content: message.cleanContent,
                channel: {
                    id: message.channel.id,
                    name: message.channel.name,
                },
                user: {
                    id: message.author.id,
                    username: message.author.username,
                    discriminator: message.author.discriminator,
                },
                timestamp: new Date().toISOString(),
                deletedAt: method === 'messageDelete' ? new Date().toISOString() : null,
            };

            try {
                database.updateMessageByID(messageToLog.id, messageToLog);
            } catch (e) {}
        }
    }
}

export default MessageLoggerWatcher;
