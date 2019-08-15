import BaseCommand from './BaseCommand';

/**
 * Asks someone to update their launcher.
 */
class UpdateCommand extends BaseCommand {
    /**
     * This event method we should listen for.
     *
     * @type {string}
     * @memberof UpdateCommand
     */
    method = 'message';

    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     *
     * @type {RegExp}
     * @memberof UpdateCommand
     */
    pattern = /^!update\s/;

    /**
     * The function that should be called when the event is fired.
     *
     * @param {string} action
     * @param {Message} message
     * @memberof UpdateCommand
     */
    async action(action, message) {
        const user = message.mentions.users.first() || '';

        const userPre = user ? ' ' : '';

        await message.channel.send(
            `${userPre}${user} You're using an old version of the launcher. Get the updated version from https://atlauncher.com/download and overwrite the old one.`,
        );

        message.delete();
    }
}

export default UpdateCommand;
