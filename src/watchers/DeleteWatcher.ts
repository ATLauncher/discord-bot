import config from 'config';
import * as Discord from 'discord.js';

import BaseWatcher from './BaseWatcher';
import { COLOURS } from '../constants/discord';
import prisma from '../utils/prisma';

/**
 * A watcher that listens for message/s being deleted. This can occur from either a user deleting it themselves or a
 * moderator deleting them. There is no way to distinguish them.
 */
class DeleteWatcher extends BaseWatcher {
    /**
     * The methods this watcher should listen on.
     */
    methods: Array<keyof Discord.ClientEvents> = ['messageDelete', 'messageDeleteBulk', 'threadDelete'];

    /**
     * If this watcher should run on the given method and message.
     */
    async shouldRun(method: keyof Discord.ClientEvents, firstArg: Discord.Message | Discord.ThreadChannel) {
        let message: Discord.Message;

        if (method === 'threadDelete') {
            return true;
        } else {
            message = firstArg as Discord.Message;
        }

        if (!message) {
            return false;
        }

        if (!(await super.shouldRun(method, message))) {
            return false;
        }

        // don't log deletion of bot messages
        if (message.author && message.author.bot) {
            return false;
        }

        // cleanContent not available so something wrong
        if (!message.cleanContent) {
            return false;
        }

        if (message.channel.id === config.get<string>('channels.botTesting')) {
            // don't log deletions in the bot testing channel
            return false;
        }

        if (message.channel.id === config.get<string>('channels.faqAndHelp')) {
            // don't log deletions in the faq-and-help channel
            return false;
        }

        if (this.bot.commandBus?.commandList.some(({ pattern }) => message.cleanContent.match(pattern) !== null)) {
            // don't log deletions of commands
            return false;
        }

        const logMessageDeletions = await prisma.setting.findUnique({
            where: { name: 'logMessageDeletions' },
        });

        return (logMessageDeletions?.value as boolean) ?? true;
    }

    /**
     * The function that should be called when the event is fired.
     */
    async action(
        method: keyof Discord.ClientEvents,
        ...args: Discord.ClientEvents['messageDelete' | 'messageDeleteBulk' | 'threadDelete']
    ) {
        // check if we're getting a collection of messages or not
        if (method === 'messageDeleteBulk') {
            (args as Discord.ClientEvents['messageDeleteBulk'])[0].forEach((value) => {
                this.logMessage(value);
            });
        } else if (method === 'threadDelete') {
            const thread = (args as Discord.ClientEvents['threadDelete'])[0];
            let message = null;

            try {
                message = await thread.fetchStarterMessage();
            } catch (ignored) {}

            this.logMessage(message, thread);
        } else {
            this.logMessage((args as Discord.ClientEvents['messageDelete'])[0]);
        }
    }

    /**
     * Logs the given message to the moderator logs channel.
     */
    async logMessage(message: Discord.Message | Discord.PartialMessage | null, thread?: Discord.ThreadChannel) {
        let user = 'Unknown';

        if (message?.author) {
            user = `${message.author} (${message.author.username}#${message.author.discriminator})`;
        } else if (thread) {
            try {
                const owner = await thread.fetchOwner();

                if (owner) {
                    user = `${owner.user} (${owner.user?.username}#${owner.user?.discriminator})`;
                }
            } catch (ignored) {}
        }

        const embed = new Discord.EmbedBuilder()
            .setTitle(`${thread ? 'Thread' : 'Message'} deleted`)
            .setColor(COLOURS.RED)
            .setTimestamp(new Date())
            .addFields([
                { name: 'User', value: user, inline: true },
                {
                    name: thread ? 'Thread' : 'Channel',
                    value: thread ? thread.name : String(message?.channel) ?? 'Unknown',
                    inline: true,
                },
                { name: 'Message', value: `\`\`\`${message?.cleanContent?.replace(/`/g, '\\`') ?? 'Unknown'}\`\`\`` },
            ]);

        this.sendEmbedToModeratorLogsChannel(embed);
    }
}

export default DeleteWatcher;
