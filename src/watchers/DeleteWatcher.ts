import * as Discord from 'discord.js';

import BaseWatcher from './BaseWatcher';
import { COLOURS } from '../constants/discord';
import * as database from '../utils/db';

/**
 * A watcher that listens for message/s being deleted. This can occur from either a user deleting it themselves or a
 * moderator deleting them. There is no way to distinguish them.
 */
class DeleteWatcher extends BaseWatcher {
    /**
     * The methods this watcher should listen on.
     */
    methods: Array<keyof Discord.ClientEvents> = ['messageDelete', 'messageDeleteBulk'];

    /**
     * If this watcher should run on the given method and message.
     */
    async shouldRun(method: keyof Discord.ClientEvents, message: Discord.Message) {
        if (!(await super.shouldRun(method, message))) {
            return false;
        }

        // don't log deletion of bot messages
        if (message.author && message.author.bot) {
            return false;
        }

        // cleanContent not available so something wrong
        if (!message.cleanContent) {
            return false;
        }

        if (
            message.cleanContent.toLowerCase().startsWith('!cyt') ||
            message.cleanContent.toLowerCase().startsWith('!log') ||
            message.cleanContent.toLowerCase().startsWith('!idbans') ||
            message.cleanContent.toLowerCase().startsWith('!working') ||
            message.cleanContent.toLowerCase().startsWith('!clean') ||
            message.cleanContent.toLowerCase().startsWith('!delete') ||
            message.cleanContent.toLowerCase().startsWith('!ask') ||
            message.cleanContent.toLowerCase().startsWith('!update') ||
            message.cleanContent.toLowerCase().startsWith('!curselag')
        ) {
            // don't log deletions of commands
            return false;
        }

        return await database.getSetting<boolean>('logMessageDeletions', true);
    }

    /**
     * The function that should be called when the event is fired.
     */
    async action(
        method: keyof Discord.ClientEvents,
        ...args: Discord.ClientEvents['messageDelete' | 'messageDeleteBulk']
    ) {
        // check if we're getting a collection of messages or not
        if (method === 'messageDeleteBulk') {
            (args as Discord.ClientEvents['messageDeleteBulk'])[0].forEach((value) => {
                this.logMessage(value);
            });
        } else {
            this.logMessage((args as Discord.ClientEvents['messageDelete'])[0]);
        }
    }

    /**
     * Logs the given message to the moderator logs channel.
     */
    logMessage(message: Discord.Message | Discord.PartialMessage) {
        let user = 'Unknown';

        if (message.author) {
            user = `${message.author} (${message.author.username}#${message.author.discriminator})`;
        }

        const embed = new Discord.MessageEmbed()
            .setTitle('Message deleted')
            .setColor(COLOURS.RED)
            .setTimestamp(new Date())
            .addField('User', user, true)
            .addField('Channel', message.channel, true)
            .addField('Message', `\`\`\`${message?.cleanContent?.replace(/`/g, '\\`')}\`\`\``);

        this.sendEmbedToModeratorLogsChannel(embed);
    }
}

export default DeleteWatcher;
