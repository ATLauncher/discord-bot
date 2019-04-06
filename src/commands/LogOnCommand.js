import Discord from 'discord.js';

import BaseCommand from './BaseCommand';
import { COLOURS, PERMISSIONS } from '../constants';
import * as database from '../db';

/**
 * This will turn message deletion logging on.
 *
 * @class LogOnCommand
 * @extends {BaseCommand}
 */
class LogOnCommand extends BaseCommand {
    /**
     * This event method we should listen for.
     *
     * @type {string}
     * @memberof LogOnCommand
     */
    method = 'message';

    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     *
     * @type {RegExp}
     * @memberof LogOnCommand
     */
    pattern = /^!logon/;

    /**
     * The permissions the user requires in order to use this command.
     *
     * @type {String[]}
     * @memberof LogOnCommand
     */
    permissions = [PERMISSIONS.MANAGE_MESSAGES];

    /**
     * The function that should be called when the event is fired.
     *
     * @param {string} action
     * @param {Message} message
     * @memberof LogOnCommand
     */
    async action(action, message) {
        await message.delete();
        await database.updateSetting('logMessageDeletions', true);

        let user = 'Unknown';

        if (message.author) {
            user = `${message.author} (${message.author.username}#${message.author.discriminator})`;
        }

        const embed = new Discord.RichEmbed()
            .setTitle('Message deletion logging turned on')
            .setColor(COLOURS.GREEN)
            .setTimestamp(new Date().toISOString())
            .addField('User', user, true);

        this.sendEmbedToModeratorLogsChannel(embed);
    }
}

export default LogOnCommand;
