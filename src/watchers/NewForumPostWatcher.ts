import config from 'config';
import * as Discord from 'discord.js';
import { ChannelType } from 'discord.js';

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

        if ((thread.parent?.type as ChannelType) !== ChannelType.GuildForum) {
            return;
        }

        // Only run on Support forum
        if (thread.parent !== this.getSupportChannel()) {
            return;
        }

        // Don't run when the only tag is Question
        if (thread.appliedTags.length === 1 && thread.appliedTags[0] === config.get<string>('forumTags.question')) {
            return;
        }

        const originalMessage = (await thread.messages.fetch()).first();

        if (
            !originalMessage?.cleanContent.includes('paste.atlauncher.com') &&
            !originalMessage?.cleanContent.includes('paste.ee')
        ) {
            const messageReply =
                `In order to help you ${originalMessage?.author}, we need some logs. Please see ` +
                'https://cdn.atlcdn.net/UploadLogs.gif on how to generate the link. **Please make sure that you ' +
                'press the button after the error/issue occurs**. Even if you do not think providing logs are ' +
                'relevant or will be helpful, **ALWAYS POST LOGS**, no matter what the situation. Once done please ' +
                'paste the link here and then someone will help you once there are logs provided.';
            let sentMessage;

            sentMessage = await originalMessage?.reply(messageReply);

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
