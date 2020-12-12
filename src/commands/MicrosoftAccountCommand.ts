import * as Discord from 'discord.js';
import { COLOURS } from '../constants/discord';
import { MICROSOFT_ACCOUNT_BLURB } from '../constants/text';

import BaseCommand from './BaseCommand';

class MicrosoftAccountCommand extends BaseCommand {
    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     */
    pattern = /^!microsoftaccount/;

    /**
     * The description of what the command does.
     */
    description = 'This will post a message about the Microsoft account migration.';

    /**
     * The function that should be called when the event is fired.
     */
    async execute(message: Discord.Message) {
        await message.channel.send(
            new Discord.MessageEmbed({
                title: 'Microsoft accounts',
                description: MICROSOFT_ACCOUNT_BLURB,
                color: COLOURS.PRIMARY,
            }),
        );

        message.delete();
    }
}

export default MicrosoftAccountCommand;
