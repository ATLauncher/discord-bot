import Discord from 'discord.js';

import BaseWatcher from './BaseWatcher';
import { COLOURS } from '../constants';

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
        const unbanned = method === 'guildBanRemove';

        let userToLog = 'Unknown';

        if (user) {
            userToLog = `${user} (${user.username}#${user.discriminator})`;
        }

        const embed = new Discord.MessageEmbed()
            .setTitle(`User ${unbanned ? 'unbanned' : 'banned'}`)
            .setColor(unbanned ? COLOURS.GREEN : COLOURS.RED)
            .setTimestamp(new Date().toISOString())
            .addField('User', userToLog);

        this.sendEmbedToModeratorLogsChannel(embed);
    }
}

export default BanWatcher;
