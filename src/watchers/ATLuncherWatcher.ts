import * as Discord from 'discord.js';

import BaseWatcher from './BaseWatcher';

class ATLuncherWatcher extends BaseWatcher {
    /**
     * The method this watcher should listen on.
     */
    methods: Array<keyof Discord.ClientEvents> = ['message', 'messageUpdate'];

    /**
     * Run the watcher with the given parameters.
     */
    async action(method: keyof Discord.ClientEvents, ...args: Discord.ClientEvents['message' | 'messageUpdate']) {
        const message = args[1] || args[0];

        if (message.cleanContent && message.cleanContent.match(/luncher/i)) {
            message.react('🥪');
        }
    }
}

export default ATLuncherWatcher;
