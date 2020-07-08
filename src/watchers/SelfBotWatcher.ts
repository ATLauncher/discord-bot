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
    methods: Array<keyof Discord.ClientEvents> = ['message', 'messageUpdate'];

    /**
     * The function that should be called when the event is fired.
     */
    async action(method: keyof Discord.ClientEvents, ...args: Discord.ClientEvents['message' | 'messageUpdate']) {
        const message = args[1] || args[0];

        if (message.cleanContent) {
            const rulesChannel = this.client.channels.cache.find(
                (channel) => channel.id === config.get('channels.rules'),
            );

            const cleanMessage = message.cleanContent.toLowerCase();

            if (cleanMessage.toLowerCase().startsWith('self.')) {
                const warningMessage = await message.reply(
                    `Please read the ${rulesChannel} channel. Bots are not allowed without permission.`,
                );

                this.addWarningToUser(message);

                message.delete({ reason: 'Selfbots not allowed' });
                warningMessage.delete({ timeout: 60000 });
            }
        }
    }
}

export default SelfBotWatcher;
