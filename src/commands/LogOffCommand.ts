import Discord from 'discord.js';

import BaseCommand from './BaseCommand';
import { COLOURS, PERMISSIONS } from '../constants';
import * as database from '../db';

/**
 * This will turn message deletion logging off.
 *
 * @class LogOffCommand
 * @extends {BaseCommand}
 */
class LogOffCommand extends BaseCommand {
    /**
     * This event method we should listen for.
     *
     * @type {string}
     * @memberof LogOffCommand
     */
    method = 'message';

    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     *
     * @type {RegExp}
     * @memberof LogOffCommand
     */
    pattern = /^!logoff/;

    /**
     * The permissions the user requires in order to use this command.
     *
     * @type {String[]}
     * @memberof LogOffCommand
     */
    permissions = [PERMISSIONS.MANAGE_MESSAGES];

    /**
     * The function that should be called when the event is fired.
     *
     * @param {string} action
     * @param {Message} message
     * @memberof LogOffCommand
     */
    async action(action, message) {
        await message.delete();
        await database.updateSetting('logMessageDeletions', false);

        const input = message.cleanContent.replace('!logoff', '');
        const timeout = input.length ? parseInt(input, 10) : null;

        let user = 'Unknown';

        if (message.author) {
            user = `${message.author} (${message.author.username}#${message.author.discriminator})`;
        }

        const embed = new Discord.MessageEmbed()
            .setTitle('Message deletion logging turned off')
            .setColor(COLOURS.RED)
            .setTimestamp(new Date().toISOString())
            .addField('User', user, true);

        this.sendEmbedToModeratorLogsChannel(embed);

        if (timeout) {
            setTimeout(async () => {
                await database.updateSetting('logMessageDeletions', true);

                const embed = new Discord.MessageEmbed()
                    .setTitle('Message deletion logging turned on')
                    .setColor(COLOURS.GREEN)
                    .setTimestamp(new Date().toISOString())
                    .addField('User', user, true);

                this.sendEmbedToModeratorLogsChannel(embed);
            }, timeout * 1000);
        }
    }
}

export default LogOffCommand;
