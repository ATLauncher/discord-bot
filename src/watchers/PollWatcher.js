import BaseWatcher from './BaseWatcher';

import config from '../config';

/**
 * This checks for people spamming links.
 */
class PollWatcher extends BaseWatcher {
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

        const cleanMessage = messageToActUpon.cleanContent.toLowerCase();

        if (
            cleanMessage.indexOf('strawpoll.me') !== -1
        ) {
            const rulesChannel = this.bot.channels.find((channel) => (channel.name === config.rules_channel));

            const warningMessage = await messageToActUpon.reply(
                `Please read the ${rulesChannel}. Polls are not allowed without permission.`
            );

            this.addWarningToUser(messageToActUpon);

            messageToActUpon.delete();
            warningMessage.delete(60000);
        }
    }
}

export default PollWatcher;
