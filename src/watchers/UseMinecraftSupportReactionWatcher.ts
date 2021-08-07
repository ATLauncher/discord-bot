import config from 'config';
import * as Discord from 'discord.js';
import logger from '../utils/logger';

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
        const reactingUser = args[1];

        if (reaction.emoji.id === config.get<string>('reactionEmoji.useMinecraftSupport')) {
            await reaction.remove();

            const reactingMember = this.bot.client.guilds.cache
                .first()
                ?.members.cache.find((member) => member.user.id === reactingUser.id);

            if (
                reactingMember?.roles.cache.has(config.get<string>('roles.moderators')) ||
                reactingMember?.roles.cache.has(config.get<string>('roles.helpers')) ||
                reactingMember?.roles.cache.has(config.get<string>('roles.packDeveloper'))
            ) {
                const minecraftSupportChannel = this.bot.client.channels.cache.find(
                    ({ id }) => id === config.get<string>('channels.minecraftSupport'),
                ) as Discord.TextChannel;

                const sentMessage = await reaction.message.channel.send(
                    `${reaction.message.author} Your message has been deleted as it's not in the correct channel. Issues with Minecraft itself, after the Play button is pressed, or with a server should be posted in ${minecraftSupportChannel}. Please repost your message, along with your logs, to that channel.`,
                );

                if (sentMessage.deletable) {
                    // delete message after 24 hours
                    setTimeout(() => sentMessage.delete(), 60 * 60 * 24 * 1000);
                }

                if (reaction.message.deletable) {
                    await reaction.message.delete();
                }
            }
        }
    }
}

export default UseMinecraftSupportReactionWatcher;
