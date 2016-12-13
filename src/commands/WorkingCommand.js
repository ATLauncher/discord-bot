import config from '../config';

import BaseCommand from './BaseCommand';

/**
 * Simple ping command that will respond to any user that says '!ping'.
 */
class PingCommand extends BaseCommand {
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
        if (this.hasBypassRole(message)) {
            return false;
        }

        message.reply('Yes I\'m working!');
    }
}