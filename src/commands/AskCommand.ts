import BaseCommand from './BaseCommand';

class AskCommand extends BaseCommand {
    /**
     * This event method we should listen for.
     *
     * @type {string}
     * @memberof AskCommand
     */
    method = 'message';

    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     *
     * @type {RegExp}
     * @memberof AskCommand
     */
    pattern = /^!ask/;

    /**
     * The function that should be called when the event is fired.
     *
     * @param {string} action
     * @param {Message} message
     * @memberof AskCommand
     */
    async action(action, message) {
        await message.channel.send(
            "Don't ask if you can ask a question. Just ask your question! https://sol.gfxile.net/dontask.html",
        );

        message.delete();
    }
}

export default AskCommand;
