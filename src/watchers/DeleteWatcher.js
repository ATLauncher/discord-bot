import Discord from 'discord.js';

import BaseWatcher from './BaseWatcher';
import { COLOURS } from '../constants';
import * as database from '../db';

/**
 * A watcher that listens for message/s being deleted. This can occur from either a user deleting it themselves or a
 * moderator deleting them. There is no way to distinguish them.
 *
 * @class DeleteWatcher
 * @extends {BaseWatcher}
 */
class DeleteWatcher extends BaseWatcher {
    /**
     * The method this watcher should listen on.
     *
     * @type {string[]}
     * @memberof DeleteWatcher
     */
    method = ['messageDelete', 'messageDeleteBulk'];

    /**
     * If this watcher should run on the given method and message.
     *
     * @param {string} method
     * @param {Message} message
     * @returns {boolean}
     * @memberof DeleteWatcher
     */
    async shouldRun(method, message) {
        if (!super.shouldRun(method, message)) {
            return false;
        }

        // don't log deletion of bot messages
        if (message.author && message.author.bot) {
            return false;
        }

        return await database.getSetting('logMessageDeletions', true);
    }

    /**
     * The function that should be called when the event is fired.
     *
     * @param {string} method
     * @param {Message} message
     * @memberof DeleteWatcher
     */
    action(method, message) {
        // check if we're getting a collection of messages or not
        if (method === 'messageDeleteBulk') {
            message.forEach((value) => {
                this.logMessage(value);
            });
        } else {
            this.logMessage(message);
        }
    }

    /**
     * Logs the given message to the moderator logs channel.
     *
     * @param {Message} message
     * @returns {void}
     * @memberof DeleteWatcher
     */
    logMessage(message) {
        // don't log deletions of commands
        if (
            message.cleanContent.toLowerCase().startsWith('!cyt') ||
            message.cleanContent.toLowerCase().startsWith('!logs') ||
            message.cleanContent.toLowerCase().startsWith('!idbans') ||
            message.cleanContent.toLowerCase().startsWith('!working') ||
            message.cleanContent.toLowerCase().startsWith('!clean')
        ) {
            return;
        }

        let user = 'Unknown';

        if (message.author) {
            user = `${message.author} (${message.author.username}#${message.author.discriminator})`;
        }

        const embed = new Discord.RichEmbed()
            .setTitle('Message deleted')
            .setColor(COLOURS.RED)
            .setTimestamp(new Date().toISOString())
            .addField('User', user, true)
            .addField('Channel', message.channel, true)
            .addField('Message', `\`\`\`${message.cleanContent.replace(/`/g, '\\`')}\`\`\``);

        this.sendEmbedToModeratorLogsChannel(embed);
    }
}

export default DeleteWatcher;
