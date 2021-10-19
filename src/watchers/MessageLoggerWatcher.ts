import * as Discord from 'discord.js';

import BaseWatcher from './BaseWatcher';

import prisma from '../utils/prisma';

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
    methods: Array<keyof Discord.ClientEvents> = ['messageCreate', 'messageDelete', 'messageUpdate'];

    /**
     * If this watcher should be run or not.
     */
    async shouldRun(): Promise<boolean> {
        return true;
    }

    /**
     * The function that should be called when the event is fired.
     */
    async action(method: keyof Discord.ClientEvents, ...args: Discord.ClientEvents['messageCreate' | 'messageUpdate']) {
        const message = args[1] || args[0];

        if (
            message.cleanContent &&
            message.author &&
            (message.channel instanceof Discord.TextChannel || message.channel instanceof Discord.ThreadChannel)
        ) {
            await prisma.message.upsert({
                where: { id: message.id },
                create: {
                    id: message.id,
                    isSystemMessage: message.system ?? false,
                    isBotMessage: message.author.bot,
                    content: message.cleanContent,
                    channel: {
                        connectOrCreate: {
                            where: { id: message.channel.id },
                            create: {
                                id: message.channel.id,
                                name: message.channel.name,
                            },
                        },
                    },
                    user: {
                        connectOrCreate: {
                            where: { id: message.author.id },
                            create: {
                                id: message.author.id,
                                username: message.author.username,
                                discriminator: message.author.discriminator,
                            },
                        },
                    },
                    createdAt: message.createdAt,
                    updatedAt: new Date(),
                    deletedAt: method === 'messageDelete' ? new Date() : null,
                },
                update: {
                    content: message.cleanContent,
                    createdAt: message.createdAt,
                    updatedAt: new Date(),
                    deletedAt: method === 'messageDelete' ? new Date() : null,
                },
            });
        }
    }
}

export default MessageLoggerWatcher;
