import BaseWatcher from './BaseWatcher';

class BanWatcher extends BaseWatcher {
    constructor(bot) {
        super(bot);
    }

    /**
     * The method this watcher should listen on.
     *
     * @type {string[]}
     */
    method = [
        'guildBanAdd',
        'guildBanRemove'
    ];

    shouldRun(method, message) {
        if (!super.shouldRun(method, message)) {
            return false;
        }

        return true;
    }

    action(method, guild, user) {
        this.logMessage(user, method);
    }

    logMessage(user, method) {
        let messageToSend = '';

        if (method === 'guildBanAdd') {
            messageToSend = `**User:** ${user} (${user.username}#${user.discriminator})\n**Action:** user banned`;
        } else {
            messageToSend = `**User:** ${user} (${user.username}#${user.discriminator})\n**Action:** user unbanned`;
        }

        this.sendMessageToModeratorLogsChannel(messageToSend);
    }
}

export default BanWatcher;