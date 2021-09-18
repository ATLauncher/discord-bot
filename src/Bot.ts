import config from 'config';
import * as Discord from 'discord.js';

import CommandBus from './CommandBus';
import WatcherBus from './WatcherBus';

import { startScheduler } from './schedule';
import { startServer } from './server';
import logger from './utils/logger';
import prisma from './utils/prisma';
import { isProductionEnvironment } from './utils/env';
import { COLOURS } from './constants/discord';

class Bot {
    public client: Discord.Client;

    commandBus: CommandBus | undefined;
    watcherBus: WatcherBus | undefined;

    constructor() {
        this.client = new Discord.Client({
            intents: [
                Discord.Intents.FLAGS.GUILDS,
                Discord.Intents.FLAGS.GUILD_MEMBERS,
                Discord.Intents.FLAGS.GUILD_BANS,
                Discord.Intents.FLAGS.GUILD_MESSAGES,
                Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                Discord.Intents.FLAGS.DIRECT_MESSAGES,
            ],
            allowedMentions: { parse: ['users'], repliedUser: true },
        });

        this.setupBot();
        this.setupCommandBus();
        this.setupWatcherBus();
    }

    /**
     * Sets up the bot.
     */
    setupBot() {
        logger.debug('Setting bot up');

        this.client.on('ready', async () => {
            logger.info('Bot started');

            startServer(this);

            startScheduler(this);

            await this.refreshFaqAndHelpChannel();

            const botTestingChannel = this.client.channels.cache.find(
                ({ id }) => id === config.get<string>('channels.botTesting'),
            );

            if (botTestingChannel) {
                (botTestingChannel as Discord.TextChannel).send("I've restarted, just FYI");
            }
        });
    }

    reloadCommandBus() {
        logger.debug('Reloading command bus');

        delete this.commandBus;

        this.setupCommandBus();
    }

    /**
     * Sets up the command bus.
     */
    setupCommandBus() {
        logger.debug('Setting command bus up');

        this.commandBus = new CommandBus(this);
    }

    /**
     * Sets up the watcher bus.
     */
    setupWatcherBus() {
        logger.debug('Setting watcher bus up');

        this.watcherBus = new WatcherBus(this);
    }

    /**
     * This will refresh all the items in FAQ and Help channel to be in line with what's defined in the config.
     */
    async refreshFaqAndHelpChannel() {
        const faqAndHelpChannel = this.client.channels.cache.find(
            ({ id }) => id === config.get<string>('channels.faqAndHelp'),
        ) as Discord.TextChannel;

        if (faqAndHelpChannel) {
            const faqAndHelpMessages =
                config.get<{ title: string; content: string; description: string; url: string }[]>('faqAndHelp');

            const setting = await prisma.setting.findUnique({ where: { name: 'faqAndHelpMessagesSize' } });

            const faqAndHelpMessagesSize = setting?.value ?? 0;
            const currentSize = JSON.stringify(faqAndHelpMessages).length;

            if (faqAndHelpMessagesSize != currentSize) {
                logger.debug('Refreshing FAQ & Help channel');

                // delete all messages
                const channelMessages = await faqAndHelpChannel.messages.fetch({ limit: 100 });
                await Promise.all(channelMessages.map((cm) => cm.delete()));

                // add all of the messages
                const sentMessages = await Promise.all(
                    faqAndHelpMessages
                        .map((m) => {
                            if (m.content) {
                                return faqAndHelpChannel.send(m.content);
                            }

                            if (m.url) {
                                return faqAndHelpChannel.send({
                                    embeds: [
                                        new Discord.MessageEmbed({
                                            ...m,
                                            color: COLOURS.PRIMARY,
                                        }),
                                    ],
                                });
                            }

                            return null;
                        })
                        .filter(Boolean),
                );

                // add a TOC to the bottom
                faqAndHelpChannel.send({
                    embeds: [
                        new Discord.MessageEmbed({
                            title: `FAQ & Help Navigation`,
                            description: sentMessages
                                .filter(Boolean)
                                .filter((message) => message?.embeds.length)
                                .map((message) => {
                                    return `:question: [${message?.embeds[0].title}](${message?.url})`;
                                })
                                .join('\n'),
                            color: COLOURS.PRIMARY,
                        }),
                    ],
                });

                // set the database the size of the messages
                await prisma.setting.upsert({
                    where: { name: 'faqAndHelpMessagesSize' },
                    create: { name: 'faqAndHelpMessagesSize', value: currentSize },
                    update: {
                        value: currentSize,
                    },
                });
            }
        }
    }

    /**
     * Starts the bot.
     */
    async start() {
        logger.debug('Starting bot');

        try {
            await this.client.login(config.get<string>('discord.clientToken'));
        } catch (err) {
            console.error(err);
            logger.error(err);
            process.exit(1);
        }
    }
}

export default Bot;
