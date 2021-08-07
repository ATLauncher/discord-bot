import * as Discord from 'discord.js';

import BaseWatcher from './BaseWatcher';
import { COLOURS } from '../constants/discord';

/**
 * Watcher to detect when bans have been added or removed
 */
class BanWatcher extends BaseWatcher {
    /**
     * The methods this watcher should listen on.
     */
    methods: Array<keyof Discord.ClientEvents> = ['guildBanAdd', 'guildBanRemove'];

    /**
     * The function that should be called when the event is fired.
     */
    async action(method: keyof Discord.ClientEvents, ...args: Discord.ClientEvents['guildBanAdd' | 'guildBanRemove']) {
        const unbanned = method === 'guildBanRemove';
        const [ban] = args;

        const user = ban.user;
        let userToLog = 'Unknown';

        if (user) {
            userToLog = `${user} (${user.username}#${user.discriminator})`;
        }

        const embed = new Discord.MessageEmbed()
            .setTitle(`User ${unbanned ? 'unbanned' : 'banned'}`)
            .setColor(unbanned ? COLOURS.GREEN : COLOURS.RED)
            .setTimestamp(new Date())
            .addField('User', userToLog);

        this.sendEmbedToModeratorLogsChannel(embed);
    }
}

export default BanWatcher;
