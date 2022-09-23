import * as Discord from 'discord.js';

import BaseCommand from './BaseCommand';
import { PERMISSIONS } from '../constants/discord';

/**
 * Simple command to remind people support is free and not immediate.
 */
class FreeSupportCommand extends BaseCommand {
    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     */
    pattern = /^!freesupport/;

    /**
     * The description of what the command does.
     */
    description = 'This will post a message about how this is free support and to be patient when asking for help.';

    /**
     * The permissions the user requires in order to use this command.
     */
    permissions = [PERMISSIONS.MANAGE_MESSAGES];

    /**
     * The function that should be called when the event is fired.
     */
    async execute(message: Discord.Message) {
        await message.channel.send({
            embeds: [
                new Discord.EmbedBuilder({
                    description:
                        "Everyone in here are volunteers who take time out of their day to help you.\n\nThey do not have to help you; it's their choice. Respect this, and please be patient when awaiting help, or they may decide not to help you.\n\nIf you don't feel like waiting, you're perfectly welcome to Google your problem and attempt to fix it yourself.",
                }),
            ],
        });

        message.delete();
    }
}

export default FreeSupportCommand;
