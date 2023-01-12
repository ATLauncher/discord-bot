import * as Discord from 'discord.js';

import BaseWatcher from './BaseWatcher';

import { ChannelType } from 'discord.js';
import logger from '../utils/logger';

/**
 * This watcher auto crossposts any messages posted in announcement channels.
 */
class AnnouncementChannelMessageWatcher extends BaseWatcher {
    /**
     * The methods this watcher should listen on.
     */
    methods: Array<keyof Discord.ClientEvents> = ['messageCreate'];

    /**
     * If this watcher should be run or not.
     */
    async shouldRun(): Promise<boolean> {
        return true;
    }

    /**
     * The function that should be called when the event is fired.
     */
    async action(method: keyof Discord.ClientEvents, ...args: Discord.ClientEvents['messageCreate']) {
        const message = args[0];

        if (message.channel.type === ChannelType.GuildAnnouncement) {
            message
                .crosspost()
                .then(() => logger.debug('Message crossposted.'))
                .catch(logger.error);
        }
    }
}

export default AnnouncementChannelMessageWatcher;
