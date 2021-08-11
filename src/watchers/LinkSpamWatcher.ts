import * as Discord from 'discord.js';

import BaseWatcher from './BaseWatcher';

/**
 * This watcher checks for people spamming links.
 */
class LinkSpamWatcher extends BaseWatcher {
    /**
     * If this watcher uses bypass rules.
     */
    usesBypassRules = true;

    /**
     * The methods this watcher should listen on.
     */
    methods: Array<keyof Discord.ClientEvents> = ['messageCreate', 'messageUpdate'];

    /**
     * The links that this watcher should remove.
     */
    links = [
        'giftsofsteam.com',
        'steamdigitalgift.com',
        'steam.cubecode.site',
        'hellcase.com',
        'fatalpvp.serv.nu',
        'splix.io',
        'gaschoolstore.com',
        'steamspecial.com',
        'gamekit.com',
        'aternos.me',
        'steamquests.com',
        'link.clashroyale.com',
        'paysafecards.org',
        'minecraftgeek.com',
        'free-gg.com',
        'fortnite-vbucks.net',
        'dlscort.site',

        // IP link grabbers
        'grabify.link',
        'iplogger.org',
        'blasze.com',
        'linkify.me',
    ];

    /**
     * The function that should be called when the event is fired.
     */
    async action(method: keyof Discord.ClientEvents, ...args: Discord.ClientEvents['messageCreate' | 'messageUpdate']) {
        const message = args[1] || args[0];

        if (message.cleanContent) {
            const cleanMessage = message.cleanContent.toLowerCase();

            if (this.links.some((string) => cleanMessage.includes(string))) {
                const warningMessage = await message.reply(
                    'This link is not allowed to be posted as it is a known hoax/spam/scam.',
                );

                this.addWarningToUser(message, 'Matched link spam filter');

                message.delete();
                setTimeout(() => warningMessage.delete(), 60000);
            }
        }
    }
}

export default LinkSpamWatcher;
