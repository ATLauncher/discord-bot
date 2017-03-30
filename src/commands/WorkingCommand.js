import BaseCommand from './BaseCommand';

/**
 * Simple command to simply test if the bot is working or not.
 */
class WorkingCommand extends BaseCommand {
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
    pattern = /^!working/;

    /**
     * The function that should be called when the event is fired.
     *
     * @param {Message} message
     */
    action(action, message) {
        message.delete();

        if (this.hasBypassRole(message)) {
            message.reply('Yes I\'m working!');
        }
    }
}

export default WorkingCommand;