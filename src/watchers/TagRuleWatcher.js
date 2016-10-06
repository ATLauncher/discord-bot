import BaseWatcher from './BaseWatcher';

import * as config from '../../config';

/**
 * This checks for people using @here and @everyone.
 */
class TagRuleWatcher extends BaseWatcher {
    constructor(bot) {
        super(bot);
    }

    /**
     * The method this watcher should listen on.
     *
     * @type {string}
     */
    method = 'message';

    async action(message) {
        if (message.system) {
            return false; // don't match system messages
        }

        if (message.author.bot) {
            return false; // don't respond to bot users
        }

        const rulesChannel = this.bot.channels.find((channel) => (channel.name === config.rules_channel));

        if (message.content.indexOf('@here') !== -1 || message.content.indexOf('@everyone') !== -1) {
            const warningMessage = await message.reply(`Please read the ${rulesChannel} channel. Use of tags such as \`@everyone\` and \`@here\` are not allowed.`);

            message.delete();
            warningMessage.delete(60000);
        }
    }
}

export default TagRuleWatcher;