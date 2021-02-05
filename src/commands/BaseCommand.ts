import * as Discord from 'discord.js';

import BaseModule from '../BaseModule';

/**
 * This is the base command class which all other commands are based on.
 */
abstract class BaseCommand extends BaseModule {
    /**
     * The pattern that a command responds to.
     */
    pattern: RegExp = /^!$/;

    /**
     * The description of what the command does.
     */
    description = 'I have no description :(';

    /**
     * The events that this module should react to.
     */
    methods: Array<keyof Discord.ClientEvents> = ['message'];

    /**
     * The action to take when this module is invoked.
     */
    async action(action: keyof Discord.ClientEvents, message: Discord.Message): Promise<void> {
        return this.execute(message);
    }

    /**
     * Checks to see if this message matches or not. If it returns true then we should act upon this message.
     */
    matches(message: Discord.Message): boolean {
        if (this.respondToAll) {
            return true;
        }

        if (message.system) {
            return false; // don't match system messages
        }

        if (message.author.bot) {
            return false; // don't respond to bot users
        }

        return message.cleanContent.match(this.pattern) !== null;
    }

    abstract execute(message: Discord.Message): Promise<void>;
}

export default BaseCommand;
