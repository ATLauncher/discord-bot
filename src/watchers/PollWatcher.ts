import config from 'config';
import * as Discord from 'discord.js';

import BaseWatcher from './BaseWatcher';

/**
 * This watcher checks for people spamming links.
 */
class PollWatcher extends BaseWatcher {
    /**
     * If this watcher uses bypass rules.
     */
    usesBypassRules = true;

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
            const cleanMessage = message.cleanContent.toLowerCase();

            if (
                cleanMessage.toLowerCase().includes('strawpoll.me') ||
                cleanMessage.toLowerCase().includes('strawpoll.com')
            ) {
                const rulesChannel = this.bot.client.channels.cache.find(
                    (channel) => channel.id === config.get('channels.rules'),
                );

                const warningMessage = await message.reply(
                    `Please read the ${rulesChannel}. Polls are not allowed without permission.`,
                );

                this.addWarningToUser(message, 'Posted a poll');

                message.delete();
                setTimeout(() => warningMessage.delete(), 60000);
            }
        }
    }
}

export default PollWatcher;
