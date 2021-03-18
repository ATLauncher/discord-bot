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
        const user = args[1];

        if (reaction.emoji.id === config.get<string>('reactionEmoji.logsPlz')) {
            if (
                reaction.message.member?.roles.cache.has(config.get<string>('roles.moderators')) ||
                reaction.message.member?.roles.cache.has(config.get<string>('roles.helpers')) ||
                reaction.message.member?.roles.cache.has(config.get<string>('roles.packDeveloper'))
            ) {
                const sentMessage = await reaction.message.reply(
                    `In order to help you, we need some logs. Please see ` +
                        'https://cdn.atlcdn.net/UploadLogs.gif on how to generate the link. Please make sure that you ' +
                        'press the button after the error/issue occurs.  Once done please paste the link here. If the logs ' +
                        "don't upload or this is an issue with a server, please upload your logs to https://paste.ee/ " +
                        'and give us the link.',
                );

                if (reaction.message.channel.type !== 'dm') {
                    // delete message after 24 hours
                    sentMessage.delete({
                        timeout: 60 * 60 * 24 * 1000,
                    });

                    await sentMessage.react('🇱');
                    await sentMessage.react('🇴');
                    await sentMessage.react('🇬');
                    await sentMessage.react('🇸');
                }

                await reaction.remove();
            }
        }
    }
}

export default LogsPlzReactionWatcher;
