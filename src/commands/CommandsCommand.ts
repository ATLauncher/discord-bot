import config from 'config';
import * as Discord from 'discord.js';

import BaseCommand from './BaseCommand';
import { COLOURS, PERMISSIONS } from '../constants/discord';

class CommandsCommand extends BaseCommand {
    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     */
    pattern = /^!commands$/;

    /**
     * The permissions the user requires in order to use this command.
     */
    permissions = [PERMISSIONS.MANAGE_MESSAGES];

    /**
     * The description of what the command does.
     */
    description = 'This will print out the list of commands the bot can respond to and what they do.';

    /**
     * The function that should be called when the event is fired.
     */
    async execute(message: Discord.Message) {
        if (
            message.channel.id !== config.get<string>('channels.botTesting') &&
            message.channel.id !== config.get<string>('channels.moderatorsDen')
        ) {
            // only run in the bot-testing and moderators-den channels
            return;
        }

        await message.reply(
            new Discord.MessageEmbed({
                title: 'Commands',
                description:
                    'This is a list of all the commands the bot understands with a short description of each and the regex pattern which it responds to.',
                color: COLOURS.PRIMARY,
                fields: this.bot.commandBus?.commandList.map((command) => ({
                    name: command.pattern,
                    value: command.description,
                    inline: true,
                })),
            }),
        );

        message.delete();
    }
}

export default CommandsCommand;
