import * as Discord from 'discord.js';

import BaseCommand from './BaseCommand';
import { COLOURS, PERMISSIONS } from '../constants/discord';
import prisma from '../utils/prisma';

/**
 * This will turn message deletion logging off.
 */
class LogOffCommand extends BaseCommand {
    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     */
    pattern = /^!logoff/;

    /**
     * The description of what the command does.
     */
    description =
        'This will temporarily disable logging deletion messages in the #moderation-logs channel for 10 minutes bt default. Can provide a different time in minutes like `!logoff 2`.';

    /**
     * The permissions the user requires in order to use this command.
     */
    permissions = [PERMISSIONS.MANAGE_MESSAGES];

    /**
     * The function that should be called when the event is fired.
     */
    async execute(message: Discord.Message) {
        await message.delete();
        await prisma.setting.upsert({
            where: { name: 'logMessageDeletions' },
            create: { name: 'logMessageDeletions', value: false },
            update: {
                value: false,
            },
        });

        const input = message.cleanContent.replace('!logoff', '');
        const timeout = input.length ? parseInt(input, 10) : null;

        let user = 'Unknown';

        if (message.author) {
            user = `${message.author} (${message.author.username}#${message.author.discriminator})`;
        }

        const embed = new Discord.EmbedBuilder()
            .setTitle('Message deletion logging turned off')
            .setColor(COLOURS.RED)
            .setTimestamp(new Date())
            .addFields([{ name: 'User', value: user, inline: true }]);

        this.sendEmbedToModeratorLogsChannel(embed);

        if (timeout) {
            setTimeout(async () => {
                await prisma.setting.upsert({
                    where: { name: 'logMessageDeletions' },
                    create: { name: 'logMessageDeletions', value: true },
                    update: {
                        value: true,
                    },
                });

                const embed = new Discord.EmbedBuilder()
                    .setTitle('Message deletion logging turned on')
                    .setColor(COLOURS.GREEN)
                    .setTimestamp(new Date())
                    .addFields([{ name: 'User', value: user, inline: true }]);

                this.sendEmbedToModeratorLogsChannel(embed);
            }, timeout * 1000);
        }
    }
}

export default LogOffCommand;
