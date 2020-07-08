import config from 'config';
import * as Discord from 'discord.js';

import CommandBus from './CommandBus';
import WatcherBus from './WatcherBus';

import logger from './utils/logger';

class Bot {
    public bot: Discord.Client;

    private commandBus: CommandBus | undefined;
    private watcherBus: WatcherBus | undefined;

    constructor() {
        this.bot = new Discord.Client();

        this.setupBot();
        this.setupCommandBus();
        this.setupWatcherBus();
    }

    /**
     * Sets up the bot.
     */
    setupBot() {
        logger.debug('Setting bot up');

        this.bot.on('ready', () => {
            logger.info('Bot started');

            const botTestingChannel = this.bot.channels.cache.find(
                ({ id }) => id === config.get<string>('channels.moderationLogs'),
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

        this.commandBus = new CommandBus(this.bot);
    }

    /**
     * Sets up the watcher bus.
     */
    setupWatcherBus() {
        logger.debug('Setting watcher bus up');

        this.watcherBus = new WatcherBus(this.bot);
    }

    /**
     * Starts the bot.
     */
    async start() {
        logger.debug('Starting bot');

        await this.bot.login(config.get<string>('discord.clientToken'));
    }
}

export default Bot;
