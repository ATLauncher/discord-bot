import config from 'config';

import BaseWatcher from './BaseWatcher';

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
     * The strings that this watcher should remove.
     *
     * @type {string[]}
     * @memberof LinkSpamWatcher
     */
    strings = [
        'this is cooldog',
        'this is memedog',
        'this is memecat',
        'this is trolldog',
        'this is screwoff',
        'chrisopeer davies',
        'jessica davies',
        'dming inappropriate photos of underage children',
        'bots are joining servers and sending mass',
        'kazuto kirigia',
        'colyn_9',
        'teenagers would cry',
        'little girl called clarissa',
        'become part of the ugandan squad',
        'discord is supposed to be closing down',
        'with the tag #1828',
    ];

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

        const rulesChannel = this.bot.channels.find(channel => channel.name === config.get('bot.rules_channel'));

        const cleanMessage = messageToActUpon.cleanContent.toLowerCase();

        if (this.strings.some(string => cleanMessage.includes(string))) {
            const warningMessage = await messageToActUpon.reply(
                `Please read the ${rulesChannel} channel. Spamming or encouraging spamming is not allowed.`,
            );

            this.addWarningToUser(messageToActUpon);

            messageToActUpon.delete();
            warningMessage.delete(60000);
        }
    }
}

export default TextSpamWatcher;
