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
            cleanMessage.indexOf('giftsofsteam.com') !== -1 ||
            cleanMessage.indexOf('steamdigitalgift.com') !== -1 ||
            cleanMessage.indexOf('steam.cubecode.site') !== -1 ||
            cleanMessage.indexOf('hellcase.com') !== -1 ||
            cleanMessage.indexOf('fatalpvp.serv.nu') !== -1 ||
            cleanMessage.indexOf('splix.io') !== -1 ||
            cleanMessage.indexOf('gaschoolstore.com') !== -1 ||
            cleanMessage.indexOf('steamspecial.com') !== -1 ||
            cleanMessage.indexOf('gamekit.com') !== -1 ||
            cleanMessage.indexOf('aternos.me') !== -1 ||
            cleanMessage.indexOf('steamquests.com') !== -1
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
