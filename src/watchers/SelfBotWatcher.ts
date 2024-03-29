import config from 'config';
import * as Discord from 'discord.js';

import BaseWatcher from './BaseWatcher';

/**
 * This watcher checks for people using self bots.
 */
class SelfBotWatcher extends BaseWatcher {
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
            const rulesChannel = this.bot.client.channels.cache.get(config.get('channels.rules'));

            const cleanMessage = message.cleanContent.toLowerCase();

            if (cleanMessage.toLowerCase().startsWith('self.')) {
                const warningMessage = await message.reply(
                    `Please read the ${rulesChannel} channel. Bots are not allowed without permission.`,
                );

                this.addWarningToUser(message, 'Using self bot');

                message.delete();
                setTimeout(() => warningMessage.delete(), 60000);
            }
        }
    }
}

export default SelfBotWatcher;
