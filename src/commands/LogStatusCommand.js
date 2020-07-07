import Discord from 'discord.js';

import BaseCommand from './BaseCommand';
import { COLOURS, PERMISSIONS } from '../constants';
import * as database from '../db';

/**
 * This will message the user if logging deleted messages is on or off.
 *
 * @class LogStatusCommand
 * @extends {BaseCommand}
 */
class LogStatusCommand extends BaseCommand {
    /**
     * This event method we should listen for.
     *
     * @type {string}
     * @memberof LogStatusCommand
     */
    method = 'message';

    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     *
     * @type {RegExp}
     * @memberof LogStatusCommand
     */
    pattern = /^!logstatus$/;

    /**
     * The permissions the user requires in order to use this command.
     *
     * @type {String[]}
     * @memberof LogStatusCommand
     */
    permissions = [PERMISSIONS.MANAGE_MESSAGES];

    /**
     * The function that should be called when the event is fired.
     *
     * @param {string} action
     * @param {Message} message
     * @memberof LogStatusCommand
     */
    async action(action, message) {
        const logMessageDeletions = await database.getSetting('logMessageDeletions', true);

        if (message.author) {
            const embed = new Discord.MessageEmbed()
                .setTitle(`Message deletion logging is turned ${logMessageDeletions ? 'on' : 'off'}`)
                .setColor(logMessageDeletions ? COLOURS.GREEN : COLOURS.RED)
                .setTimestamp(new Date().toISOString());

            await message.author.send({ embed });
        }

        await message.delete();
    }
}

export default LogStatusCommand;
