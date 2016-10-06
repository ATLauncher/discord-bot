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

    /**
     * Checks to see if this message matches or not. If it returns true then we should respond to this message.
     *
     * @param {Message} message
     * @returns {boolean}
     */
    matches(message) {
        if (message.system) {
            return false; // don't match system messages
        }

        if (message.author.bot) {
            return false; // don't respond to bot users
        }

        return this.pattern && message.cleanContent.match(this.pattern) !== null;
    }

}

export default BaseCommand;