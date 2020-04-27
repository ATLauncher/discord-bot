import BaseWatcher from './BaseWatcher';

/**
 * This watches for people posting Discord invite links.
 *
 * @class TLauncherWatcher
 * @extends {BaseWatcher}
 */
class TLauncherWatcher extends BaseWatcher {
    /**
     * If this watcher should run on bots or not.
     *
     * @type {boolean}
     * @memberof TLauncherWatcher
     */
    shouldRunOnBots = false;

    /**
     * If this watcher uses bypass rules.
     *
     * @type {boolean}
     * @memberof TLauncherWatcher
     */
    usesBypassRules = true;

    /**
     * The method this watcher should listen on.
     *
     * @type {string|string[]}
     * @memberof TLauncherWatcher
     */
    method = ['message', 'messageUpdate'];

    /**
     * The function that should be called when the event is fired.
     *
     * @param {string} method
     * @param {Message} message
     * @param {Message} updatedMessage
     * @memberof TLauncherWatcher
     */
    async action(method, message, updatedMessage) {
        let messageToActUpon = message;

        if (method === 'messageUpdate') {
            messageToActUpon = updatedMessage;
        }

        if (!this.isAModeratedChannel(messageToActUpon.channel.name)) {
            return;
        }

        if (
            messageToActUpon.cleanContent.match(/[^a]t ?launcher/i) !== null ||
            messageToActUpon.cleanContent.match(/^t ?launcher/i) !== null
        ) {
            if (await this.hasUserSeenTLauncherMessage(messageToActUpon)) {
                return;
            }

            const warningMessage = await messageToActUpon.reply(
                'This is the Discord for ATLauncher. We only support ATLauncher here and no other launchers or cracked accounts. If you need support with another launcher, please visit their support channels.',
            );

            this.addWarningToUser(messageToActUpon);
            this.addHasSeenTLauncherMessageToUser(messageToActUpon);

            messageToActUpon.delete();
            warningMessage.delete(60000);
        }
    }
}

export default TLauncherWatcher;
