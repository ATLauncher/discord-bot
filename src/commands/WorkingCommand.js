import BaseCommand from './BaseCommand';

/**
 * Simple command to simply test if the bot is working or not.
 */
class WorkingCommand extends BaseCommand {
    /**
     * This event method we should listen for.
     *
     * @type {string}
     * @memberof WorkingCommand
     */
    method = 'message';

    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     *
     * @type {RegExp}
     * @memberof WorkingCommand
     */
    pattern = /^!working/;

    /**
     * The function that should be called when the event is fired.
     *
     * @param {string} action
     * @param {Message} message
     * @memberof WorkingCommand
     */
    async action(action, message) {
        if (this.hasBypassRole(message)) {
            await message.reply('Yes I\'m "working"!');
        }

        message.delete();
    }
}

export default WorkingCommand;
