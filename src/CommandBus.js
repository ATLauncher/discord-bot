import fs from 'fs';

/**
 * The command bus loads all the commands and sets up the listeners and any configuration.
 */
class CommandBus {
    constructor(bot) {
        this.bot = bot;
        this.commands = {};
        this.commandFiles = fs.readdirSync(`${__dirname}/commands`).filter((file) => (file !== 'BaseCommand.js'));

        this.loadCommands();
        this.setupCommandListeners();
    }

    /**
     * This will load all the commands in the commands directory.
     */
    loadCommands() {
        let loadedCommands = [];

        // instantiate all the commands
        loadedCommands = this.commandFiles.map((commandFile) => {
            const commandClass = require(`${__dirname}/commands/${commandFile}`);

            return new commandClass.default(this.bot);
        });

        // remove any non active commands
        loadedCommands = loadedCommands.filter((command) => (command.enabled));

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
     */
    setupCommandListeners() {
        Object.keys(this.commands).forEach((method) => {
            this.bot.on(method, (...args) => {
                const command = this.commands[method].find((command) => (command.matches(...args)));

                if (command && command.shouldRun(method, ...args)) {
                    command.action(method, ...args);
                }
            });
        });
    }
}

export default CommandBus;
