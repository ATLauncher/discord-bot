import * as Discord from 'discord.js';

import BaseModule from '../BaseModule';

/**
 * This is the base watcher class which all watchers are defined from.
 */
abstract class BaseWatcher extends BaseModule {
    /**
     * If this module should respond to all incoming messages or not.
     */
    respondToAll = true;

    /**
     * If this watcher should only run on moderated channels.
     */
    onlyModeratedChannels = false;

    /**
     * This checks to see if this module should run for this message.
     */
    async shouldRun(
        method: keyof Discord.ClientEvents,
        message: Discord.Message,
        updatedMessage?: Discord.Message,
    ): Promise<boolean> {
        let messageToActUpon = message;

        if (method === 'messageUpdate' && updatedMessage) {
            messageToActUpon = updatedMessage;
        }

        if (this.onlyModeratedChannels && !this.isAModeratedChannel(messageToActUpon.channel)) {
            return false;
        }

        return super.shouldRun(method, message, updatedMessage);
    }
}

export default BaseWatcher;
