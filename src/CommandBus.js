import fs from 'fs';

/**
 * The command bus loads all the commands and sets up the listeners and any configuration.
 */
class CommandBus {
    constructor(bot) {
        this.bot = bot;
        this.commands = [];
        this.commandFiles = fs.readdirSync(`${__dirname}/commands`).filter((file) => (file !== 'BaseCommand.js'));

        this.loadCommands();
        this.setupCommandListeners();
    }

    /**
     * This will load all the commands in the commands directory.
     */
    loadCommands() {
        // instantiate all the commands
        this.commands = this.commandFiles.map((commandFile) => {
            const commandClass = require(`${__dirname}/commands/${commandFile}`);

            return new commandClass.default(this.bot);
        });

        // remove any non active commands
        this.commands = this.commands.filter((command) => ( command.enabled ));
    }

    /**
     * This will setup all the command listeners and register them with the bot.
     */
    setupCommandListeners() {
        this.commands.forEach((command) => {
            this.bot.on(command.method, command.respond);
        });
    }
}

export default CommandBus;