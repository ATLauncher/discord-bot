import config from 'config';
import * as Discord from 'discord.js';

import CommandBus from './CommandBus';
import WatcherBus from './WatcherBus';

import { startScheduler } from './schedule';
import { startServer } from './server';
import logger from './utils/logger';
import { isProductionEnvironment } from './utils/env';

class Bot {
    public client: Discord.Client;

    commandBus: CommandBus | undefined;
    watcherBus: WatcherBus | undefined;

    constructor() {
        this.client = new Discord.Client();

        this.setupBot();
        this.setupCommandBus();
        this.setupWatcherBus();
    }

    /**
     * Sets up the bot.
     */
    setupBot() {
        logger.debug('Setting bot up');

        this.client.on('ready', () => {
            logger.info('Bot started');

            startServer(this);

            startScheduler(this);

            if (isProductionEnvironment()) {
                const botTestingChannel = this.client.channels.cache.find(
                    ({ id }) => id === config.get<string>('channels.botTesting'),
                );

                if (botTestingChannel) {
                    (botTestingChannel as Discord.TextChannel).send("I've restarted, just FYI");
                }
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
     * Starts the bot.
     */
    async start() {
        logger.debug('Starting bot');

        await this.client.login(config.get<string>('discord.clientToken'));
    }
}

export default Bot;
