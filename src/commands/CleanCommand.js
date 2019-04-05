import BaseCommand from './BaseCommand';
import { PERMISSIONS } from '../constants';
import * as database from '../db';

/**
 * This will clean the last x messages from the current channel.
 *
 * @class CleanCommand
 * @extends {BaseCommand}
 */
class CleanCommand extends BaseCommand {
    /**
     * This event method we should listen for.
     *
     * @type {string}
     * @memberof CleanCommand
     */
    method = 'message';

    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     *
     * @type {RegExp}
     * @memberof CleanCommand
     */
    pattern = /^!clean/;

    /**
     * The permissions the user requires in order to use this command.
     *
     * @type {String[]}
     * @memberof CleanCommand
     */
    permissions = [PERMISSIONS.MANAGE_MESSAGES];

    /**
     * The function that should be called when the event is fired.
     *
     * @param {string} action
     * @param {Message} message
     * @memberof CleanCommand
     */
    async action(action, message) {
        await database.updateSetting('logMessageDeletions', false);
        await message.delete();

        const input = message.cleanContent.substr(7);

        if (input.length) {
            const linesToClean = parseInt(input, 10);

            if (linesToClean > 0 && linesToClean <= 25) {
                await message.channel.bulkDelete(linesToClean);
            }
        }

        await database.updateSetting('logMessageDeletions', true);
    }
}

export default CleanCommand;
