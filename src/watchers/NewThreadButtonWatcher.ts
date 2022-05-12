import * as Discord from 'discord.js';
import { isTextChannel } from '../server/utils';
import prisma from '../utils/prisma';

import BaseWatcher from './BaseWatcher';

class NewThreadButtonWatcher extends BaseWatcher {
    /**
     * The method this watcher should listen on.
     */
    methods: Array<keyof Discord.ClientEvents> = ['interactionCreate'];

    /**
     * Run the watcher with the given parameters.
     */
    async action(method: keyof Discord.ClientEvents, ...args: Discord.ClientEvents['interactionCreate']) {
        const interaction = args[0];

        if (interaction.isButton() && interaction.customId === 'createThread') {
            const user = interaction.user;
            const channel = interaction.channel;

            if (isTextChannel(channel) && (await this.canCreateNewSupportThread(user))) {
                await prisma.user.upsert({
                    where: {
                        id: user.id,
                    },
                    create: {
                        id: user.id,
                        username: user.username,
                        discriminator: user.discriminator,
                        lastSupportThreadCreation: new Date(),
                    },
                    update: {
                        username: user.username,
                        discriminator: user.discriminator,
                        lastSupportThreadCreation: new Date(),
                    },
                });

                const thread = await channel.threads.create({
                    name: `${user?.username}'s Thread`,
                    autoArchiveDuration: 4320, // 3 days
                });

                await thread.send({
                    content: `A thread has been spun up for you ${user}. Please keep all messages in here to keep things organised and tidy.\n\nPlease provide a brief description of the issue you're facing as well as providing logs as shown below:`,
                    embeds: [
                        new Discord.MessageEmbed({
                            image: {
                                url: 'https://cdn.atlcdn.net/UploadLogs.gif',
                            },
                        }),
                    ],
                });

                if (channel === this.getMinecraftSupportChannel()) {
                    await this.bot.addMessageToTopOfSupportChannel('minecraftSupport');
                } else if (channel === this.getLauncherSupportChannel()) {
                    await this.bot.addMessageToTopOfSupportChannel('launcherSupport');
                }
            } else {
                interaction.reply({
                    content:
                        'You can only create one thread every 5 minutes. Please use your existing thread or try again later.',
                    ephemeral: true,
                });
            }
        }
    }
}

export default NewThreadButtonWatcher;
