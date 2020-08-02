import config from 'config';
import * as Discord from 'discord.js';

import BaseCommand from './BaseCommand';
import { PERMISSIONS } from '../constants/discord';

/**
 * Command that will Jail people by adding a role for 5 minutes.
 */
class JailCommand extends BaseCommand {
    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     */
    pattern = /^!jail/;

    /**
     * The permissions the user requires in order to use this command.
     */
    permissions = [PERMISSIONS.MANAGE_MESSAGES];

    /**
     * The function that should be called when the event is fired.
     */
    async execute(message: Discord.Message) {
        const member = message.mentions.members?.first();

        if (member) {
            this.addUserToJail(member);
        }

        message.delete();
    }
}

export default JailCommand;
