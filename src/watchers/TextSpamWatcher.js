import BaseWatcher from './BaseWatcher';

import config from '../config';

/**
 * This watcher checks for people spamming text stuff.
 *
 * @class TextSpamWatcher
 * @extends {BaseWatcher}
 */
class TextSpamWatcher extends BaseWatcher {
    /**
     * If this watcher uses bypass rules.
     *
     * @type {boolean}
     * @memberof TextSpamWatcher
     */
    usesBypassRules = true;

    /**
     * The method this watcher should listen on.
     *
     * @type {string|string[]}
     * @memberof TextSpamWatcher
     */
    method = ['message', 'messageUpdate'];

    /**
     * Run the watcher with the given parameters.
     *
     * @param {string} method
     * @param {Message} message
     * @param {Message} updatedMessage
     * @memberof TextSpamWatcher
     */
    async action(method, message, updatedMessage) {
        let messageToActUpon = message;

        if (method === 'messageUpdate') {
            messageToActUpon = updatedMessage;
        }

        const rulesChannel = this.bot.channels.find((channel) => {
            return channel.name === config.rules_channel;
        });

        const cleanMessage = messageToActUpon.cleanContent.toLowerCase();

        if (
            cleanMessage.toLowerCase().includes('this is cooldog') ||
            cleanMessage.toLowerCase().includes('this is memedog') ||
            cleanMessage.toLowerCase().includes('this is memecat') ||
            cleanMessage.toLowerCase().includes('this is trolldog') ||
            cleanMessage.toLowerCase().includes('this is screwoff') ||
            cleanMessage.toLowerCase().includes('chrisopeer davies') ||
            cleanMessage.toLowerCase().includes('jessica davies') ||
            cleanMessage.toLowerCase().includes('dming inappropriate photos of underage children') ||
            cleanMessage.toLowerCase().includes('bots are joining servers and sending mass') ||
            cleanMessage.toLowerCase().includes('kazuto kirigia') ||
            cleanMessage.toLowerCase().includes('colyn_9') ||
            cleanMessage.toLowerCase().includes('teenagers would cry') ||
            cleanMessage.toLowerCase().includes('little girl called clarissa') ||
            cleanMessage.toLowerCase().includes('become part of the ugandan squad')
        ) {
            const warningMessage = await messageToActUpon.reply(
                `Please read the ${rulesChannel} channel. Spamming or encouraging spamming is not allowed.`
            );

            this.addWarningToUser(messageToActUpon);

            messageToActUpon.delete();
            warningMessage.delete(60000);
        }
    }
}

export default TextSpamWatcher;
