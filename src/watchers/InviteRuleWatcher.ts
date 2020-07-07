import BaseWatcher from './BaseWatcher';

/**
 * This watches for people posting Discord invite links.
 *
 * @class InviteRuleWatcher
 * @extends {BaseWatcher}
 */
class InviteRuleWatcher extends BaseWatcher {
    /**
     * If this watcher should run on bots or not.
     *
     * @type {boolean}
     * @memberof InviteRuleWatcher
     */
    shouldRunOnBots = false;

    /**
     * If this watcher uses bypass rules.
     *
     * @type {boolean}
     * @memberof InviteRuleWatcher
     */
    usesBypassRules = true;

    /**
     * If this watcher should only run on moderated channels.
     *
     * @type {boolean}
     * @memberof TLauncherWatcher
     */
    onlyModeratedChannels = true;

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
     * @memberof InviteRuleWatcher
     */
    async action(method, message, updatedMessage) {
        let messageToActUpon = message;

        if (method === 'messageUpdate') {
            messageToActUpon = updatedMessage;
        }

        if (messageToActUpon.cleanContent.match(/discord(?:\.gg|app\.com\/invite)\//i) !== null) {
            const warningMessage = await messageToActUpon.reply(
                'Discord invite links are not allowed due to constant spam. ' +
                    'If you must share Discord invite links with someone, please do it privately.',
            );

            this.addWarningToUser(messageToActUpon);

            messageToActUpon.delete();
            warningMessage.delete(60000);
        }
    }
}

export default InviteRuleWatcher;
