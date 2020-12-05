import fs from 'fs';
import * as Discord from 'discord.js';

import BaseCommand from './commands/BaseCommand';
import logger from './utils/logger';
import Bot from './Bot';

/**
 * The command bus loads all the commands and sets up the listeners and any configuration.
 */
class CommandBus {
    /**
     * The instance of the Bot.
     */
    bot: Bot;

    /**
     * List of commands and the client events they respond to.
     */
    commands: { [action in keyof Discord.ClientEvents]?: BaseCommand[] };

    /**
     * List of commands.
     */
    commandList: BaseCommand[] = [];

    /**
     * List of command filenames.
     */
    commandFiles: string[];

    /**
     * Creates an instance of CommandBus.
     */
    constructor(bot: Bot) {
        this.bot = bot;
        this.commands = {};
        this.commandFiles = fs.readdirSync(`${__dirname}/commands`).filter((file) => !file.startsWith('BaseCommand.'));

        this.loadCommands();
        this.setupCommandListeners();
    }

    /**
     * This will load all the commands in the commands directory.
     */
    loadCommands() {
        let loadedCommands: BaseCommand[] = [];

        // instantiate all the commands
        loadedCommands = this.commandFiles.map((commandFile) => {
            const CommandClass = require(`${__dirname}/commands/${commandFile}`).default;

            return new CommandClass(this.bot);
        });

        // remove any non active commands
        loadedCommands = loadedCommands.filter(({ enabled }) => enabled);

        // group the commands by method
        loadedCommands.forEach((command) => {
            logger.debug(`Loading command ${command.constructor.name}`);
            command.methods.forEach((method) => {
                if (!this.commands[method]) {
                    this.commands[method] = [];
                }

                this.commandList.push(command);
                this.commands[method]?.push(command);
            });
        });
    }

    /**
     * This will setup all the command listeners and register them with the bot.
     */
    setupCommandListeners() {
        Object.keys(this.commands).forEach((method) => {
            this.bot.client.on(method as keyof Discord.ClientEvents, async (...args) => {
                // @ts-ignore different ClientEvents have different args layout, so this type isn't safe
                const command = this.commands[method as keyof Discord.ClientEvents]?.find((c) => c.matches(...args));

                // @ts-ignore
                if (command && (await command.shouldRun(method, ...args))) {
                    // @ts-ignore
                    command.action(method, ...args);
                }
            });
        });
    }
}

export default CommandBus;
