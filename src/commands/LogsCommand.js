import BaseCommand from './BaseCommand';

/**
 * Asks someone to submit logs.
 */
class LogsCommand extends BaseCommand {
    /**
     * This event method we should listen for.
     *
     * @type {string}
     * @memberof LogsCommand
     */
    method = 'message';

    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     *
     * @type {RegExp}
     * @memberof LogsCommand
     */
    pattern = /^!logs/;

    /**
     * The function that should be called when the event is fired.
     *
     * @param {string} action
     * @param {Message} message
     * @memberof LogsCommand
     */
    async action(action, message) {
        const user = message.mentions.users.first() || '';

        const userPre = user ? ' ' : '';

        const sentMessage = await message.channel.send(
            `In order to help you${userPre}${user}, we need some logs. Please see https://enderman.atlcdn.net/UploadLogs.gif ` +
                `on how to generate the link. Please make sure that you press the button after the error/issue occurs. ` +
                `Once done please paste the link here.`
        );

        message.delete();

        // delete message after 24 hours
        sentMessage.delete(60 * 60 * 24 * 1000);

        await sentMessage.react('🇱');
        await sentMessage.react('🇴');
        await sentMessage.react('🇬');
        sentMessage.react('🇸');
    }
}

export default LogsCommand;
