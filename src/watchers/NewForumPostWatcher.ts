import * as Discord from 'discord.js';
import { ChannelType } from 'discord.js';
import { isTextChannel } from '../server/utils';
import logger from '../utils/logger';
import prisma from '../utils/prisma';

import BaseWatcher from './BaseWatcher';

class NewForumPostWatcher extends BaseWatcher {
    /**
     * The method this watcher should listen on.
     */
    methods: Array<keyof Discord.ClientEvents> = ['threadCreate'];

    /**
     * Run the watcher with the given parameters.
     */
    async action(method: keyof Discord.ClientEvents, ...args: Discord.ClientEvents['threadCreate']) {
        const thread = args[0];

        if (
            (thread.parent?.type as ChannelType) === ChannelType.GuildForum &&
            !(await thread.messages.fetch()).first()?.cleanContent.includes('paste.atlauncher.com') &&
            !(await thread.messages.fetch()).first()?.cleanContent.includes('paste.ee')
        ) {
            const messageReply =
                `In order to help you, we need some logs. Please see ` +
                'https://cdn.atlcdn.net/UploadLogs.gif on how to generate the link. Please make sure that you ' +
                'press the button after the error/issue occurs. Once done please paste the link here. If the logs ' +
                "don't upload or this is an issue with a server, please upload your logs to https://paste.ee/ " +
                'and give us the link.';
            let sentMessage;

            sentMessage = await thread.send(messageReply);

            if (sentMessage && sentMessage.deletable) {
                await sentMessage.react('🇱');
                await sentMessage.react('🇴');
                await sentMessage.react('🇬');
                await sentMessage.react('🇸');
            }
        }
    }
}

export default NewForumPostWatcher;