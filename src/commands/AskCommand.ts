import * as Discord from 'discord.js';

import BaseCommand from './BaseCommand';

class AskCommand extends BaseCommand {
    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     */
    pattern = /^!ask/;

    /**
     * The description of what the command does.
     */
    description = 'This will post a message saying not to ask to ask and just to ask your question.';

    /**
     * The function that should be called when the event is fired.
     */
    async execute(message: Discord.Message) {
        await message.channel.send(
            "Don't ask if you can ask a question. Just ask your question! https://sol.gfxile.net/dontask.html",
        );

        message.delete();
    }
}

export default AskCommand;
