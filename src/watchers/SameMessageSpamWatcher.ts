import * as Discord from 'discord.js';

import BaseWatcher from './BaseWatcher';

import prisma from '../utils/prisma';
import { subSeconds } from 'date-fns';

/**
 * This watcher checks for people spamming the same message multiple times.
 *
 * It will trigger when the same message is sent 3 times within 30 seconds.
 */
class SameMessageSpamWatcher extends BaseWatcher {
    /**
     * If this watcher should run on bots or not.
     */
    shouldRunOnBots = false;

    /**
     * If this watcher uses bypass rules.
     */
    usesBypassRules = true;

    /**
     * If this watcher should only run on moderated channels.
     */
    onlyModeratedChannels = true;

    /**
     * The methods this watcher should listen on.
     */
    methods: Array<keyof Discord.ClientEvents> = ['messageCreate', 'messageUpdate'];

    /**
     * The function that should be called when the event is fired.
     */
    async action(method: keyof Discord.ClientEvents, ...args: Discord.ClientEvents['messageCreate' | 'messageUpdate']) {
        const message = args[1] || args[0];

        if (message.cleanContent) {
            const count = await prisma.message.count({
                where: {
                    content: message.cleanContent,
                    createdAt: {
                        gte: subSeconds(new Date(), 30),
                    },
                },
            });

            if (count >= 3) {
                const warningMessage = await message.reply('Please do not spam the same message.');

                this.addWarningToUser(message, 'Matched same message spam filter');

                message.delete();
                setTimeout(() => warningMessage.delete(), 60000);
            }
        }
    }
}

export default SameMessageSpamWatcher;
