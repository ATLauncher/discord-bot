import BaseCommand from './BaseCommand';

/**
 * Scans submitted log files. currently only from paste.atlauncher.com/ and must have permissions to run command.
 */
class ScanCommand extends BaseCommand {
    /**
     * This event method we should listen for.
     *
     * @type {string}
     * @memberof ScanCommand
     */
    method = 'message';

    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     *
     * @type {RegExp}
     * @memberof ScanCommand
     */
    pattern = /^!scan\s[0-9][a-f]/;

    /**
     * The function that should be called when the event is fired.
     *
     * @param {string} action
     * @param {Message} message
     * @memberof ScanCommand
     */
    async action(action, message) {
        let pasteCode = String(this.pattern);
        pasteCode = pasteCode.substr(pasteCode.length - 8);
        let fileLink = "https://paste.atlauncher.com/view/raw/"+pasteCode;
        await message.reply(
            `Now scanning logfile ${fileLink}, this may take a moment...`
         );


    }
}

export default ScanCommand;

