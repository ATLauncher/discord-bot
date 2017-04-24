import BaseCommand from './BaseCommand';

/**
 * Simple command to simply test if the bot is working or not.
 */
class CalmYourTitsCommand extends BaseCommand {
    /**
     * This event method we should listen for.
     *
     * @type {string}
     */
    method = 'message';

    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     *
     * @type {RegExp}
     */
    pattern = /^!cyt/;

    /**
     * The function that should be called when the event is fired.
     *
     * @param {string} action
     * @param {Message} message
     */
    action(action, message) {
        message.delete();

        if (this.hasBypassRole(message)) {
            message.channel.send(
                '⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔\n' +
                '\n' +
                'Everyone in here are volunteers who take time out of their day to help you.\n' +
                'They do not have to help you; it is their choice. Respect this, and be patient when awaiting help, ' +
                'or they may decide not to help you.\n' +
                '\n' +
                'If you don\'t feel like waiting you are perfectly welcome to Google your problem and attempt to ' +
                'fix it yourself.\n' +
                '\n' +
                'If you tried to get this level of support elsewhere, you\'d be paying over $50(USD)/hr. Be ' +
                'grateful.\n' +
                '\n' +
                '⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔'
            );
        }
    }
}

export default CalmYourTitsCommand;
