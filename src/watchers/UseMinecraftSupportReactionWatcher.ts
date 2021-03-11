import config from 'config';
import * as Discord from 'discord.js';

import BaseWatcher from './BaseWatcher';

class UseMinecraftSupportReactionWatcher extends BaseWatcher {
    /**
     * The method this watcher should listen on.
     */
    methods: Array<keyof Discord.ClientEvents> = ['messageReactionAdd'];

    /**
     * Run the watcher with the given parameters.
     */
    async action(method: keyof Discord.ClientEvents, ...args: Discord.ClientEvents['messageReactionAdd']) {
        const reaction = args[0];

        if (
            reaction.emoji.id === config.get<string>('reactionEmoji.useMinecraftSupport') &&
            (!reaction.message.member?.roles.cache.has(config.get<string>('roles.moderators')) ||
                reaction.message.member?.roles.cache.has(config.get<string>('roles.helpers')) ||
                reaction.message.member?.roles.cache.has(config.get<string>('roles.packDeveloper')))
        ) {
            const minecraftSupportChannel = this.bot.client.channels.cache.find(
                ({ id }) => id === config.get<string>('channels.minecraftSupport'),
            ) as Discord.TextChannel;

            const sentMessage = await reaction.message.reply(
                `Your message has been deleted as it's not in the correct channel. Issues with Minecraft itself, after the Play button is pressed, should be posted in ${minecraftSupportChannel}. Please repost your message, along with your logs, to that channel.`,
            );

            if (reaction.message.channel.type !== 'dm') {
                // delete message after 24 hours
                sentMessage.delete({
                    timeout: 60 * 60 * 24 * 1000,
                });
            }

            if (reaction.message.deletable) {
                await reaction.message.delete();
            }
        }

        await reaction.remove();
    }
}

export default UseMinecraftSupportReactionWatcher;
