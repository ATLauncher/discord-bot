import * as Discord from 'discord.js';

import BaseWatcher from './BaseWatcher';

/**
 * This watches for people posting Discord invite links.
 */
class TLauncherWatcher extends BaseWatcher {
    /**
     * If this watcher should run on bots or not.
     */
    shouldRunOnBots = false;

    /**
     * If this watcher uses bypass rules.
     */
    usesBypassRules = true;

    /**
     * If this watcher should only run on moderated channels.
     */
    onlyModeratedChannels = true;

    /**
     * The methods this watcher should listen on.
     */
    methods: Array<keyof Discord.ClientEvents> = ['message', 'messageUpdate'];

    /**
     * The function that should be called when the event is fired.
     */
    async action(method: keyof Discord.ClientEvents, ...args: Discord.ClientEvents['message' | 'messageUpdate']) {
        const message = args[1] || args[0];

        if (message.cleanContent) {
            if (
                message.cleanContent.match(/ t ?launcher/i) !== null ||
                message.cleanContent.match(/^t ?launcher/i) !== null
            ) {
                if (await this.hasUserSeenTLauncherMessage(message)) {
                    return;
                }

                const warningMessage = await message.reply(
                    'This is the Discord for ATLauncher. We only support ATLauncher here and no other launchers or cracked accounts. If you need support with another launcher, please visit their support channels.',
                );

                this.addWarningToUser(message, 'Matched TLauncher filter');
                this.addHasSeenTLauncherMessageToUser(message);

                message.delete({ reason: 'Asking for TLauncher help' });
                warningMessage.delete({ timeout: 60000 });
            }
        }
    }
}

export default TLauncherWatcher;
