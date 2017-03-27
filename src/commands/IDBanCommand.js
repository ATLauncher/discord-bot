import BaseCommand from './BaseCommand';

/**
 * Simple command to ban a uaer by their ID.
 */
class IDBanCommand extends BaseCommand {
    constructor(bot) {
        super(bot);
    }

    /**
     * This event method we should listen for.
     *
     * @type {string}
     */
    method = 'message';

    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action method.
     *
     * @type {RegExp}
     */
    pattern = /^!idban/;

    /**
     * The function that should be called when the event is fired.
     *
     * @param {Message} message
     */
    action(action, message) {
        if (this.hasBypassRole(message)) {
            const id = message.cleanContent.substr(7);

            message.guild.ban(id, 1);

            message.reply(`User with ID of '${id}' has been banned.`);
        }

        message.delete();
    }
}

export default IDBanCommand;