import * as Discord from 'discord.js';

import BaseCommand from './BaseCommand';
import { COLOURS, PERMISSIONS } from '../constants/discord';
import * as database from '../utils/db';

/**
 * This will turn message deletion logging on.
 */
class LogOnCommand extends BaseCommand {
    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     */
    pattern = /^!logon/;

    /**
     * The permissions the user requires in order to use this command.
     */
    permissions = [PERMISSIONS.MANAGE_MESSAGES];

    /**
     * The function that should be called when the event is fired.
     */
    async execute(message: Discord.Message) {
        await message.delete();
        await database.updateSetting('logMessageDeletions', true);

        let user = 'Unknown';

        if (message.author) {
            user = `${message.author} (${message.author.username}#${message.author.discriminator})`;
        }

        const embed = new Discord.MessageEmbed()
            .setTitle('Message deletion logging turned on')
            .setColor(COLOURS.GREEN)
            .setTimestamp(new Date())
            .addField('User', user, true);

        this.sendEmbedToModeratorLogsChannel(embed);
    }
}

export default LogOnCommand;
