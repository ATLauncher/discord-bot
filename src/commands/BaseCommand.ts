import * as Discord from 'discord.js';

import BaseModule from '../BaseModule';

/**
 * This is the base command class which all other commands are based on.
 */
abstract class BaseCommand extends BaseModule {
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

    abstract async execute(message: Discord.Message): Promise<void>;
}

export default BaseCommand;
