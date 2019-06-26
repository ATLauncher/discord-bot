import BaseWatcher from './BaseWatcher';

/**
 * This watcher checks for people spamming links.
 *
 * @class LinkSpamWatcher
 * @extends {BaseWatcher}
 */
class LinkSpamWatcher extends BaseWatcher {
    /**
     * If this watcher uses bypass rules.
     *
     * @type {boolean}
     * @memberof LinkSpamWatcher
     */
    usesBypassRules = true;

    /**
     * The method this watcher should listen on.
     *
     * @type {string|string[]}
     * @memberof LinkSpamWatcher
     */
    method = ['message', 'messageUpdate'];

    /**
     * The links that this watcher should remove.
     *
     * @type {string[]}
     * @memberof LinkSpamWatcher
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
    ];

    /**
     * The function that should be called when the event is fired.
     *
     * @param {string} method
     * @param {Message} message
     * @param {Message} updatedMessage
     * @memberof LinkSpamWatcher
     */
    async action(method, message, updatedMessage) {
        let messageToActUpon = message;

        if (method === 'messageUpdate') {
            messageToActUpon = updatedMessage;
        }

        const cleanMessage = messageToActUpon.cleanContent.toLowerCase();

        if (this.links.some(string => cleanMessage.includes(string))) {
            const warningMessage = await messageToActUpon.reply(
                'This link is not allowed to be posted as it is a known hoax/spam/scam.',
            );

            this.addWarningToUser(messageToActUpon);

            messageToActUpon.delete();
            warningMessage.delete(60000);
        }
    }
}

export default LinkSpamWatcher;
