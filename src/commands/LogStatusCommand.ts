import * as Discord from 'discord.js';

import BaseCommand from './BaseCommand';

import prisma from '../utils/prisma';
import { COLOURS, PERMISSIONS } from '../constants/discord';

/**
 * This will message the user if logging deleted messages is on or off.
 */
class LogStatusCommand extends BaseCommand {
    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     */
    pattern = /^!logstatus$/;

    /**
     * The description of what the command does.
     */
    description = 'This will DM you with the status of deleted message logging.';

    /**
     * The permissions the user requires in order to use this command.
     */
    permissions = [PERMISSIONS.MANAGE_MESSAGES];

    /**
     * The function that should be called when the event is fired.
     */
    async execute(message: Discord.Message) {
        const logMessageDeletionsSetting = await prisma.setting.findUnique({
            where: { name: 'logMessageDeletions' },
        });

        const logMessageDeletions = logMessageDeletionsSetting?.value ?? true;

        if (message.author) {
            const embed = new Discord.EmbedBuilder()
                .setTitle(`Message deletion logging is turned ${logMessageDeletions ? 'on' : 'off'}`)
                .setColor(logMessageDeletions ? COLOURS.GREEN : COLOURS.RED)
                .setTimestamp(new Date());

            await message.author.send({ embeds: [embed] });
        }

        await message.delete();
    }
}

export default LogStatusCommand;
