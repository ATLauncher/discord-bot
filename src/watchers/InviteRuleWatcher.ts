import * as Discord from 'discord.js';

import BaseWatcher from './BaseWatcher';

/**
 * This watches for people posting Discord invite links.
 */
class InviteRuleWatcher extends BaseWatcher {
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
            if (message.cleanContent.match(/discord(?:\.gg|app\.com\/invite)\//i) !== null) {
                const warningMessage = await message.reply(
                    'Discord invite links are not allowed due to constant spam. ' +
                        'If you must share Discord invite links with someone, please do it privately.',
                );

                this.addWarningToUser(message);

                message.delete({ reason: 'Discord invite links are not allowed' });
                warningMessage.delete({ timeout: 60000 });
            }
        }
    }
}

export default InviteRuleWatcher;
