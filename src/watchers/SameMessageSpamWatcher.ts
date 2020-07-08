import * as Discord from 'discord.js';

import BaseWatcher from './BaseWatcher';

import * as database from '../utils/db';

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
    methods: Array<keyof Discord.ClientEvents> = ['message', 'messageUpdate'];

    /**
     * The function that should be called when the event is fired.
     */
    async action(method: keyof Discord.ClientEvents, ...args: Discord.ClientEvents['message' | 'messageUpdate']) {
        const message = args[1] || args[0];

        if (message.cleanContent) {
            const count = await database.countMessagesInLast(message.cleanContent, 30);

            if (count >= 3) {
                const warningMessage = await message.reply('Please do not spam the same message.');

                this.addWarningToUser(message);

                message.delete();
                warningMessage.delete({ timeout: 60000 });
            }
        }
    }
}

export default SameMessageSpamWatcher;
