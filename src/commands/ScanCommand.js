import BaseCommand from './BaseCommand';
import download from 'download-file';
import fs from 'fs';

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
    pattern = /^!scan\s([0-9a-f]{8})/;

    /**
     * The function that should be called when the event is fired.
     *
     * @param {string} action
     * @param {Message} message
     * @memberof ScanCommand
     */

    async action(action, message) {
        let file = "";
        let [pasteCode] = message.cleanContent.match(this.pattern);
        pasteCode = pasteCode.substr(pasteCode.length - 8);
        let fileLink = "https://paste.atlauncher.com/view/raw/"+pasteCode;
        await message.reply(
            `Now scanning logfile ${fileLink}, this may take a moment...`
         );
        /* setup download variables */
        var options = {
            directory: "./scan/",
            filename: pasteCode+".txt"
        };
        /* download file and alert if invalid link*/
        /**try {*/download(fileLink, options, function(err){
            if (err) throw err
            file = options.directory+options.filename
            /* console.log("meow") */
        });  /**}*/
        /*TODO: fix error checking so a 404 does not crash the app*/

        /** catch (e) {
            await message.reply(
                `It seems went wrong with downloading the file, check your spelling and try again in a few moments.`
            );
        }
        finally {
            await message.reply(
                `Scan terminated with error.`
            );
        } */

        /** repeatable function call with explination of what went wrong.
         * sort functions by most common error to least common.
         * all get checked so multiple problems might get caught*/
        if (this.isFound(file, search)) {

            await message.reply(
                `error explanation here`
            );

        }

        /** clean up file when done and alert scan is finished*/
        fs.unlink(file)
        await message.reply(
            `Log scan complete!`
        );

    }

    /**
     *
     * Search Functions
     *
     * */

    /** simple search function to see if a specific string occurs*/
    async isFound(file, search) {
        let exists = false;

        return exists;
    }
    /** simple search function to see how many times a line occurs (ensure only one crash is scanned per file)*/
    async findCount(file, search) {
        let count = 0;

        return count;
    }
}

export default ScanCommand;

