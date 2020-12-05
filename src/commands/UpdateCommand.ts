import * as Discord from 'discord.js';

import BaseCommand from './BaseCommand';

/**
 * Asks someone to update their launcher.
 */
class UpdateCommand extends BaseCommand {
    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     */
    pattern = /^!update/;

    /**
     * The description of what the command does.
     */
    description =
        'This will post a message saying to update the launcher if the user is in offline mode. A user can be optionally mentioned in the command.';

    /**
     * The function that should be called when the event is fired.
     */
    async execute(message: Discord.Message) {
        const user = message.mentions.users.first() || '';

        const userPre = user ? ' ' : '';

        await message.channel.send(
            `${userPre}${user} You're using an old version of the launcher. Get the updated version from https://atlauncher.com/download and overwrite the old one.`,
        );

        message.delete();
    }
}

export default UpdateCommand;
