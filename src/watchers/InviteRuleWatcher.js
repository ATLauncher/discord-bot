import BaseWatcher from './BaseWatcher';

/**
 * This checks for people posting Discord invite links.
 */
class InviteRuleWatcher extends BaseWatcher {
    constructor(bot) {
        super(bot);
    }

    shouldRunOnBots = false;

    usesBypassRules = true;

    /**
     * The method this watcher should listen on.
     *
     * @type {string|string[]}
     */
    method = [
        'message',
        'messageUpdate'
    ];

    async action(method, message, updatedMessage) {
        if (method === 'messageUpdate') {
            message = updatedMessage;
        }

        if (this.isAModeratedChannel(message.channel.name) && message.cleanContent.match(/discord(?:\.gg|app\.com\/invite)\//i) !== null) {
            const warningMessage = await message.reply(`Discord invite links are not allowed due to constant spam. If you must share Discord invite links with someone, please do it privately.`);

            message.delete();
            warningMessage.delete(60000);
        }
    }
}

export default InviteRuleWatcher;