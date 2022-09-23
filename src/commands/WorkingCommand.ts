import * as Discord from 'discord.js';
import { PERMISSIONS } from '../constants/discord';

import BaseCommand from './BaseCommand';

/**
 * Simple command to simply test if the bot is working or not.
 */
class WorkingCommand extends BaseCommand {
    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     */
    pattern = /^!working/;

    /**
     * The description of what the command does.
     */
    description = 'This will post a message to test if the bot is working.';

    /**
     * The permissions the user requires in order to use this command.
     */
    permissions = [PERMISSIONS.MANAGE_MESSAGES];

    /**
     * The function that should be called when the event is fired.
     */
    async execute(message: Discord.Message) {
        await message.reply('Yes I\'m "working"!');

        message.delete();
    }
}

export default WorkingCommand;
