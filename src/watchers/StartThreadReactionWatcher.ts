import config from 'config';
import * as Discord from 'discord.js';

import BaseWatcher from './BaseWatcher';

class StartThreadReactionWatcher extends BaseWatcher {
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

        if (reaction.emoji.name === '🧵') {
            await reaction.remove();

            const reactingMember = this.bot.client.guilds.cache
                .first()
                ?.members.cache.find((member) => member.user.id === reactingUser.id);

            if (
                reactingMember?.roles.cache.has(config.get<string>('roles.moderators')) ||
                reactingMember?.roles.cache.has(config.get<string>('roles.helpers')) ||
                reactingMember?.roles.cache.has(config.get<string>('roles.packDeveloper'))
            ) {
                // if we're not in a thread, then start one
                if (!reaction.message.channel.isThread()) {
                    const isFromBot = reaction.message.author?.bot;
                    const user = isFromBot ? reaction.message.mentions.users.first() : reaction.message.author;

                    const thread = await reaction.message.startThread({
                        name: `${user?.username}'s Thread`,
                        autoArchiveDuration: 1440, // 1 day
                    });

                    thread.members.add(reactingMember);

                    if (isFromBot) {
                        thread.send(`${reaction.message.mentions.users.first()}`);
                    }

                    await thread.send(
                        `A thread has been spun up for you ${user}. Please keep any relevant messages in here to keep things organised and tidy.`,
                    );
                }
            }
        }
    }
}

export default StartThreadReactionWatcher;
