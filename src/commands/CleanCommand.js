import Discord from 'discord.js';

import BaseCommand from './BaseCommand';
import { COLOURS, PERMISSIONS } from '../constants';

/**
 * This will clean the last x messages from the current channel.
 *
 * @class CleanCommand
 * @extends {BaseCommand}
 */
class CleanCommand extends BaseCommand {
    /**
     * This event method we should listen for.
     *
     * @type {string}
     * @memberof CleanCommand
     */
    method = 'message';

    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     *
     * @type {RegExp}
     * @memberof CleanCommand
     */
    pattern = /^!clean/;

    /**
     * The permissions the user requires in order to use this command.
     *
     * @type {String[]}
     * @memberof CleanCommand
     */
    permissions = [PERMISSIONS.MANAGE_MESSAGES];

    /**
     * The function that should be called when the event is fired.
     *
     * @param {string} action
     * @param {Message} message
     * @memberof CleanCommand
     */
    async action(action, message) {
        await message.delete();

        const input = message.cleanContent.substr(7);

        if (input.length) {
            const linesToClean = parseInt(input, 10);

            if (linesToClean > 0 && linesToClean <= 100) {
                await message.channel.bulkDelete(linesToClean);

                let user = 'Unknown';

                if (message.author) {
                    user = `${message.author} (${message.author.username}#${message.author.discriminator})`;
                }

                const embed = new Discord.RichEmbed()
                    .setTitle('Clean command run')
                    .setColor(COLOURS.YELLOW)
                    .setTimestamp(new Date().toISOString())
                    .addField('User', user, true)
                    .addField('Channel', message.channel, true)
                    .addField('Lines', linesToClean, true);

                this.sendEmbedToModeratorLogsChannel(embed);
            }
        }
    }
}

export default CleanCommand;
