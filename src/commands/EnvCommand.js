import BaseCommand from './BaseCommand';

/**
 * Simple command to simply test if the bot is working or not.
 */
class EnvCommand extends BaseCommand {
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
    pattern = /^!env/;

    /**
     * The function that should be called when the event is fired.
     *
     * @param {Message} message
     */
    action(action, message) {
        if (!this.hasBypassRole(message)) {
            message.delete();
        }

        if (!message.author) {
            return false;
        }

        console.log(process.env);

        //message.author.sendMessage(`\`\`\`${JSON.stringify(process.env)}\`\`\``);
    }
}

export default EnvCommand;