import Discord from 'discord.js';

import CommandBus from './CommandBus';
import WatcherBus from './WatcherBus';

import config from './config';

class Bot {
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
        this.bot.on('ready', () => {
            // eslint-disable-next-line no-console
            console.log('I am ready!');

            const botTestingChannel = this.bot.channels.find((channel) => {
                return channel.name === config.bot_testing_channel;
            });

            if (botTestingChannel) {
                botTestingChannel.send("I've restarted, just FYI");
            }
        });
    }

    reloadCommandBus() {
        delete this.commandBus;
        this.setupCommandBus();
    }

    /**
     * Sets up the command bus.
     */
    setupCommandBus() {
        this.commandBus = new CommandBus(this.bot);
    }

    /**
     * Sets up the watcher bus.
     */
    setupWatcherBus() {
        this.watcherBus = new WatcherBus(this.bot);
    }

    /**
     * Starts the bot.
     */
    async start() {
        await this.bot.login(config.client_token);
    }
}

export default Bot;
