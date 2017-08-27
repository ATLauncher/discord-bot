import BaseCommand from './BaseCommand';

/**
 * Simple command to remind people support is free and not immediate.
 *
 * @class CalmYourTitsCommand
 * @extends {BaseCommand}
 */
class CalmYourTitsCommand extends BaseCommand {
    /**
     * This event method we should listen for.
     *
     * @type {string}
     * @memberof CalmYourTitsCommand
     */
    method = 'message';

    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     *
     * @type {RegExp}
     * @memberof CalmYourTitsCommand
     */
    pattern = /^!cyt/;

    /**
     * The function that should be called when the event is fired.
     *
     * @param {string} action
     * @param {Message} message
     * @memberof CalmYourTitsCommand
     */
    action(action, message) {
        message.delete();

        if (this.hasBypassRole(message)) {
            message.channel.send(
                [
                    '⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔',
                    '',
                    'Everyone in here are volunteers who take time out of their day to help you.',
                    'They do not have to help you; it is their choice. Respect this, and be patient when awaiting ' +
                        'help, or they may decide not to help you.',
                    '',
                    "If you don't feel like waiting you are perfectly welcome to Google your problem and attempt to " +
                        'fix it yourself.',
                    '',
                    "If you tried to get this level of support elsewhere, you'd be paying over $50(USD)/hr. Be " +
                        'grateful.',
                    '',
                    '⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔~~⛔',
                ].join('\n')
            );
        }
    }
}

export default CalmYourTitsCommand;
