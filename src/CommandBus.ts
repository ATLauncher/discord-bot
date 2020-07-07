import fs from 'fs';

/**
 * The command bus loads all the commands and sets up the listeners and any configuration.
 *
 * @class CommandBus
 */
class CommandBus {
    /**
     * Creates an instance of CommandBus.
     *
     * @param {Client} bot
     * @memberof CommandBus
     */
    constructor(bot) {
        this.bot = bot;
        this.commands = {};
        this.commandFiles = fs.readdirSync(`${__dirname}/commands`).filter((file) => file !== 'BaseCommand.js');

        this.loadCommands();
        this.setupCommandListeners();
    }

    /**
     * This will load all the commands in the commands directory.
     *
     * @memberof CommandBus
     */
    loadCommands() {
        let loadedCommands = [];

        // instantiate all the commands
        loadedCommands = this.commandFiles.map((commandFile) => {
            const commandClass = require(`${__dirname}/commands/${commandFile}`);

            return new commandClass.default(this.bot);
        });

        // remove any non active commands
        loadedCommands = loadedCommands.filter(({ enabled }) => enabled);

        // group the commands by method
        loadedCommands.forEach((command) => {
            if (!this.commands.hasOwnProperty(command.method)) {
                this.commands[command.method] = [];
            }

            this.commands[command.method].push(command);
        });
    }

    /**
     * This will setup all the command listeners and register them with the bot.
     *
     * @memberof CommandBus
     */
    setupCommandListeners() {
        Object.keys(this.commands).forEach((method) => {
            this.bot.on(method, (...args) => {
                const command = this.commands[method].find((c) => c.matches(...args));

                if (command && command.shouldRun(method, ...args)) {
                    command.action(method, ...args);
                }
            });
        });
    }
}

export default CommandBus;
