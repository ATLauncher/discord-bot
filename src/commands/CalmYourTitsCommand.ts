import * as Discord from 'discord.js';

import BaseCommand from './BaseCommand';
import { PERMISSIONS } from '../constants/discord';

/**
 * Simple command to remind people support is free and not immediate.
 *
 * @class CalmYourTitsCommand
 * @extends {BaseCommand}
 */
class CalmYourTitsCommand extends BaseCommand {
    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     */
    pattern = /^!cyt/;

    /**
     * The permissions the user requires in order to use this command.
     */
    permissions = [PERMISSIONS.MANAGE_MESSAGES];

    /**
     * The function that should be called when the event is fired.
     */
    async execute(message: Discord.Message) {
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
            ].join('\n'),
        );

        message.delete();
    }
}

export default CalmYourTitsCommand;
