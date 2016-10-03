import Discord from 'discord.js';

import CommandBus from './CommandBus';

import config from '../config';

class Bot {
    constructor() {
        this.bot = new Discord.Client();

        this.setupBot();
        this.setupCommandBus();
    }

    /**
     * Sets up the bot.
     */
    setupBot() {
        this.bot.on('ready', () => {
            console.log('I am ready!');
        });
    }

    /**
     * Sets up the command bus.
     */
    setupCommandBus() {
        this.commandBus = new CommandBus(this.bot);
    }

    /**
     * Starts the bot.
     */
    async start() {
        await this.bot.login(config.client_token);
    }
}

export default Bot;