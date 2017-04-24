import BaseWatcher from './BaseWatcher';

/**
 * This checks for people posting Discord invite links.
 */
class InviteRuleWatcher extends BaseWatcher {
    shouldRunOnBots = false;

    usesBypassRules = true;

    /**
     * The method this watcher should listen on.
     *
     * @type {string[]}
     */
    method = [
        'message',
        'messageUpdate'
    ];

    async action(method, message, updatedMessage) {
        let messageToActUpon = message;

        if (method === 'messageUpdate') {
            messageToActUpon = updatedMessage;
        }

        if (!this.isAModeratedChannel(messageToActUpon.channel.name)) {
            return;
        }

        if (messageToActUpon.cleanContent.match(/discord(?:\.gg|app\.com\/invite)\//i) !== null) {
            const warningMessage = await messageToActUpon.reply(
                `Discord invite links are not allowed due to constant spam. ` +
                `If you must share Discord invite links with someone, please do it privately.`
            );

            this.addWarningToUser(messageToActUpon);

            messageToActUpon.delete();
            warningMessage.delete(60000);
        }
    }
}

export default InviteRuleWatcher;
