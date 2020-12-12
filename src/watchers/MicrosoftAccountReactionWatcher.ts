import config from 'config';
import * as Discord from 'discord.js';
import { COLOURS } from '../constants/discord';
import { MICROSOFT_ACCOUNT_BLURB } from '../constants/text';

import BaseWatcher from './BaseWatcher';

class MicrosoftAccountReactionWatcher extends BaseWatcher {
    /**
     * The method this watcher should listen on.
     */
    methods: Array<keyof Discord.ClientEvents> = ['messageReactionAdd'];

    /**
     * Run the watcher with the given parameters.
     */
    async action(method: keyof Discord.ClientEvents, ...args: Discord.ClientEvents['messageReactionAdd']) {
        const reaction = args[0];

        if (
            reaction.emoji.id === config.get<string>('reactionEmoji.microsoftAccount') &&
            (!reaction.message.member?.roles.cache.has(config.get<string>('roles.moderators')) ||
                reaction.message.member?.roles.cache.has(config.get<string>('roles.helpers')) ||
                reaction.message.member?.roles.cache.has(config.get<string>('roles.packDeveloper')))
        ) {
            await reaction.remove();

            await reaction.message.reply(
                new Discord.MessageEmbed({
                    title: 'Microsoft accounts',
                    description: MICROSOFT_ACCOUNT_BLURB,
                    color: COLOURS.PRIMARY,
                }),
            );
        }
    }
}

export default MicrosoftAccountReactionWatcher;
