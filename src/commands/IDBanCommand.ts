import * as Discord from 'discord.js';

import BaseCommand from './BaseCommand';
import { PERMISSIONS } from '../constants/discord';

/**
 * This will ban the given user/s by their Discord user id.
 */
class IDBanCommand extends BaseCommand {
    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     */
    pattern = /^!idban/;

    /**
     * The description of what the command does.
     */
    description = "This will ban a list of Discord user id's given after the command separated by a space.";

    /**
     * The permissions the user requires in order to use this command.
     */
    permissions = [PERMISSIONS.BAN_MEMBERS];

    /**
     * The function that should be called when the event is fired.
     */
    async execute(message: Discord.Message) {
        const ids = message.cleanContent.substr(7);

        if (!ids.length) {
            return;
        }

        if (ids.indexOf(' ') === -1) {
            return;
        }

        const splitIDs = ids.split(' ');

        splitIDs.forEach((id) => {
            message.guild?.members.ban(id, { days: 1 });

            message.channel.send(`User with ID of '${id}' has been banned.`);
        });

        message.delete();
    }
}

export default IDBanCommand;
