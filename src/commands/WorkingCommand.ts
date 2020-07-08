import * as Discord from 'discord.js';

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
     * The function that should be called when the event is fired.
     */
    async execute(message: Discord.Message) {
        if (this.hasBypassRole(message)) {
            await message.reply('Yes I\'m "working"!');
        }

        message.delete();
    }
}

export default WorkingCommand;
