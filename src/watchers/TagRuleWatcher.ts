import config from 'config';
import * as Discord from 'discord.js';

import BaseWatcher from './BaseWatcher';

/**
 * This watcher checks for people using bad tags such as @here, @all and @everyone.
 */
class TagRuleWatcher extends BaseWatcher {
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
    strings = ['@everyone', '@channel', '@here'];

    /**
     * The function that should be called when the event is fired.
     */
    async action(method: keyof Discord.ClientEvents, ...args: Discord.ClientEvents['messageCreate' | 'messageUpdate']) {
        const message = args[1] || args[0];

        if (message.cleanContent) {
            const rulesChannel = this.bot.client.channels.cache.get(config.get('channels.rules'));

            const cleanMessage = message.cleanContent.toLowerCase();

            if (this.strings.some((string) => cleanMessage.includes(string))) {
                const warningMessage = await message.channel.send(
                    `${message.member} Please read the ${rulesChannel} channel. Tags such as \`@everyone\` and \`@here\` are not allowed.`,
                );

                this.addWarningToUser(message, 'Trying to use a broad tag');

                message.delete();
                setTimeout(() => warningMessage.delete(), 60000);
            }
        }
    }
}

export default TagRuleWatcher;
