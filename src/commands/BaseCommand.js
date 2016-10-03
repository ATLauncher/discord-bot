class BaseCommand {
    constructor(bot) {
        this.bot = bot;
    }

    /**
     * If this command is enabled or not.
     *
     * @type {boolean}
     */
    enabled = true;
}

export default BaseCommand;