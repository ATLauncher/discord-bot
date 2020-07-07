import BaseModule from '../BaseModule';

/**
 * This is the base watcher class which all watchers are defined from.
 *
 * @class BaseWatcher
 * @extends {BaseModule}
 */
class BaseWatcher extends BaseModule {
    /**
     * If this module should respond to all incoming messages or not.
     *
     * @type {boolean}
     * @memberof BaseWatcher
     */
    respondToAll = true;

    /**
     * If this watcher should only run on moderated channels.
     *
     * @type {boolean}
     * @memberof TLauncherWatcher
     */
    onlyModeratedChannels = false;

    /**
     * This checks to see if this module should run for this message.
     *
     * @param {string} method
     * @param {Message} message
     * @param {Message|object} [updatedMessage={}]
     * @returns {boolean}
     * @memberof BaseModule
     */
    async shouldRun(method, message, updatedMessage = {}) {
        let messageToActUpon = message;

        if (method === 'messageUpdate') {
            messageToActUpon = updatedMessage;
        }

        if (this.onlyModeratedChannels && !this.isAModeratedChannel(messageToActUpon.channel)) {
            return false;
        }

        return super.shouldRun(method, message, updatedMessage);
    }
}

export default BaseWatcher;
