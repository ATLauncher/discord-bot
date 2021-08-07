import config from 'config';
import * as Discord from 'discord.js';

import BaseWatcher from './BaseWatcher';

class LogsPlzReactionWatcher extends BaseWatcher {
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

        if (reaction.emoji.id === config.get<string>('reactionEmoji.logsPlz')) {
            await reaction.remove();

            const reactingMember = this.bot.client.guilds.cache
                .first()
                ?.members.cache.find((member) => member.user.id === reactingUser.id);

            if (
                reactingMember?.roles.cache.has(config.get<string>('roles.moderators')) ||
                reactingMember?.roles.cache.has(config.get<string>('roles.helpers')) ||
                reactingMember?.roles.cache.has(config.get<string>('roles.packDeveloper'))
            ) {
                const sentMessage = await reaction.message.reply(
                    `In order to help you, we need some logs. Please see ` +
                        'https://cdn.atlcdn.net/UploadLogs.gif on how to generate the link. Please make sure that you ' +
                        'press the button after the error/issue occurs.  Once done please paste the link here. If the logs ' +
                        "don't upload or this is an issue with a server, please upload your logs to https://paste.ee/ " +
                        'and give us the link.',
                );

                if (sentMessage.deletable) {
                    await sentMessage.react('🇱');
                    await sentMessage.react('🇴');
                    await sentMessage.react('🇬');
                    await sentMessage.react('🇸');
                }
            }
        }
    }
}

export default LogsPlzReactionWatcher;
