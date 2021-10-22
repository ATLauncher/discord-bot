import config from 'config';
import * as Discord from 'discord.js';
import { COLOURS } from '../constants/discord';
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

                await minecraftSupportChannel.send({
                    content: `${reaction.message.author} Your message in ${reaction.message.channel} was deleted as it wasn't in the correct channel. I'm reposting your message here.`,
                    embeds: [
                        new Discord.MessageEmbed({
                            title: `Message from ${reaction.message.author?.username}`,
                            description: reaction.message.content || '',
                            color: COLOURS.PRIMARY,
                        }),
                    ],
                });

                if (reaction.message.deletable) {
                    await reaction.message.delete();
                }
            }
        }
    }
}

export default UseMinecraftSupportReactionWatcher;
