import BaseCommand from './BaseCommand';

/**
 * This will ban the given user/s by their Discord user id.
 *
 * @class IDBanCommand
 * @extends {BaseCommand}
 */
class IDBanCommand extends BaseCommand {
    /**
     * This event method we should listen for.
     *
     * @type {string}
     * @memberof IDBanCommand
     */
    method = 'message';

    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     *
     * @type {RegExp}
     * @memberof IDBanCommand
     */
    pattern = /^!idban/;

    /**
     * The function that should be called when the event is fired.
     *
     * @param {string} action
     * @param {Message} message
     * @memberof IDBanCommand
     */
    action(action, message) {
        if (this.hasBypassRole(message)) {
            const ids = message.cleanContent.substr(7);

            if (!ids.length) {
                return;
            }

            if (ids.indexOf(' ') === -1) {
                return;
            }

            const splitIDs = ids.split(' ');

            splitIDs.forEach((id) => {
                message.guild.ban(id, 1);

                message.channel.send(`User with ID of '${id}' has been banned.`);
            });
        }

        message.delete();
    }
}

export default IDBanCommand;
