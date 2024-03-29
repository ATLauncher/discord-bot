import config from 'config';
import * as Discord from 'discord.js';

import BaseWatcher from './BaseWatcher';

/**
 * This watcher checks for people asking for support in non support channels.
 */
class SupportRuleWatcher extends BaseWatcher {
    /**
     * Disabled since there's no real chat channels anymore and this just hurts.
     */
    enabled = false;

    /**
     * If this watcher uses bypass rules.
     */
    usesBypassRules = true;

    /**
     * The methods this watcher should listen on.
     */
    methods: Array<keyof Discord.ClientEvents> = ['messageCreate', 'messageUpdate'];

    /**
     * The strings that this watcher should remove.
     */
    strings = ['paste.atlauncher.com', 'USERSDIR\\Instances', 'USERSDIR/Instances'];

    /**
     * The function that should be called when the event is fired.
     */
    async action(method: keyof Discord.ClientEvents, ...args: Discord.ClientEvents['messageCreate' | 'messageUpdate']) {
        const message = args[1] || args[0];

        if (message.cleanContent) {
            const supportChannel = this.bot.client.channels.cache.get(config.get('channels.supportAndQuestions'));

            const nonSupportChannels = this.bot.client.channels.cache.filter(({ id }) =>
                config.get<string[]>('noSupportChannels').includes(id),
            );

            const cleanMessage = message.cleanContent.toLowerCase();

            if (this.strings.some((string) => cleanMessage.includes(string))) {
                if (nonSupportChannels.some(({ id }) => id === message.channel.id)) {
                    const warningMessage = await message.channel.send(
                        `${message.member} It looks like you're asking for support. Please use the ${supportChannel} channel.`,
                    );

                    this.addWarningToUser(message, 'Asking for support outside of support channels');

                    message.delete();
                    setTimeout(() => warningMessage.delete(), 60000);
                }
            }
        }
    }
}

export default SupportRuleWatcher;
