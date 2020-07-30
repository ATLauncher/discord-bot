import config from 'config';
import * as Discord from 'discord.js';

import BaseWatcher from './BaseWatcher';

/**
 * This watcher checks for people saying bad words.
 */
class LogsPlzReactionWatcher extends BaseWatcher {
    /**
     * The methoda this watcher should listen on.
     */
    methods: Array<keyof Discord.ClientEvents> = ['messageReactionAdd'];

    /**
     * Run the watcher with the given parameters.
     */
    async action(method: keyof Discord.ClientEvents, ...args: Discord.ClientEvents['messageReactionAdd']) {
        const reaction = args[0];

        if (reaction.emoji.id === config.get<string>('logsEmoji')) {
            await reaction.remove();

            const sentMessage = await reaction.message.reply(
                `In order to help you, we need some logs. Please see ` +
                    'https://cdn.atlcdn.net/UploadLogs.gif on how to generate the link. Please make sure that you ' +
                    'press the button after the error/issue occurs.  Once done please paste the link here. If the logs ' +
                    "don't upload or this is an issue with a server, please upload your logs to https://pastebin.com/ " +
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
        }
    }
}

export default LogsPlzReactionWatcher;
