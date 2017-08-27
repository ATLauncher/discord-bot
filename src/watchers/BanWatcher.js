import BaseWatcher from './BaseWatcher';

/**
 * Watcher to detect when bans have been added or removed
 *
 * @class BanWatcher
 * @extends {BaseWatcher}
 */
class BanWatcher extends BaseWatcher {
    /**
     * The method/s this watcher should listen on.
     *
     * @type {string|string[]}
     * @memberof BanWatcher
     */
    method = ['guildBanAdd', 'guildBanRemove'];

    /**
     * The function that should be called when the event is fired.
     *
     * @param {string} method
     * @param {Guild} guild
     * @param {User} user
     * @memberof BanWatcher
     */
    action(method, guild, user) {
        const messageParts = [
            `**User:** ${user} (${user.username}#${user.discriminator})`,
            `**Action:** user ${method === 'guildBanRemove' ? 'un' : ''}banned`,
        ];

        this.sendMessageToModeratorLogsChannel(messageParts.join('\n'));
    }
}

export default BanWatcher;
