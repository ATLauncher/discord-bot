import { Message } from 'discord.js';
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
     * The pattern to match against. If the message matches this pattern then we will respond to it with the respond method.
     *
     * @type {RegExp}
     */
    pattern = /^!ping$/i;

    /**
     * The function that should be called when the event is fired.
     *
     * @param {Message} message
     */
    respond(message) {
        message.reply('pong');
    }
}

export default PingCommand;