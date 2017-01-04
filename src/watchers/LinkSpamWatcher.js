import BaseWatcher from './BaseWatcher';

/**
 * This checks for people spamming links.
 */
class LinkSpamWatcher extends BaseWatcher {
    constructor(bot) {
        super(bot);
    }

    usesBypassRules = true;

    /**
     * The method this watcher should listen on.
     *
     * @type {string}
     */
    method = [
        'message',
        'messageUpdate'
    ];

    async action(method, message, updatedMessage) {
        if (method === 'messageUpdate') {
            message = updatedMessage;
        }

        if (message.cleanContent.toLowerCase().indexOf('giftsofsteam.com') !== -1 || message.cleanContent.toLowerCase().indexOf('steamdigitalgift.com') !== -1) {
            const warningMessage = await message.reply(`This link is not allowed to be posted as it is a known hoax/spam/scam.`);

            this.addWarningToUser(message);

            message.delete();
            warningMessage.delete(60000);
        }
    }
}

export default LinkSpamWatcher;