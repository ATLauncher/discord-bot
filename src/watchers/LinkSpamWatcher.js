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
     * @memberof InviteRuleWatcher
     */
    method = ['message', 'messageUpdate'];

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

        if (
            cleanMessage.includes('giftsofsteam.com') ||
            cleanMessage.includes('steamdigitalgift.com') ||
            cleanMessage.includes('steam.cubecode.site') ||
            cleanMessage.includes('hellcase.com') ||
            cleanMessage.includes('fatalpvp.serv.nu') ||
            cleanMessage.includes('splix.io') ||
            cleanMessage.includes('gaschoolstore.com') ||
            cleanMessage.includes('steamspecial.com') ||
            cleanMessage.includes('gamekit.com') ||
            cleanMessage.includes('aternos.me') ||
            cleanMessage.includes('steamquests.com') ||
            cleanMessage.includes('link.clashroyale.com') ||
            cleanMessage.includes('paysafecards.org') ||
            cleanMessage.includes('minecraftgeek.com') ||
            cleanMessage.includes('?ref=') ||
            cleanMessage.includes('free-gg.com') ||
            cleanMessage.includes('fortnite-vbucks.net')
        ) {
            const warningMessage = await messageToActUpon.reply(
                `This link is not allowed to be posted as it is a known hoax/spam/scam.`
            );

            this.addWarningToUser(messageToActUpon);

            messageToActUpon.delete();
            warningMessage.delete(60000);
        }
    }
}

export default LinkSpamWatcher;
