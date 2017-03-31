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

    action(method, guild, user) {
        this.logMessage(user, method);
    }

    logMessage(user, method) {
        let messageParts = [];

        messageParts.push(`**User:** ${user} (${user.username}#${user.discriminator})`);

        if (method === 'guildBanAdd') {
            messageParts.push(`**Action:** user banned`);
        } else {
            messageParts.push(`**Action:** user unbanned`);
        }

        this.sendMessageToModeratorLogsChannel(messageParts.join("\n"));
    }
}

export default BanWatcher;