import config from './config';

import * as database from './db';

/**
 * This is the base module class. A module is either a command or a watcher.
 *
 * @class BaseModule
 */
class BaseModule {
    /**
     * Creates an instance of BaseModule.
     *
     * @param {Client} bot
     * @memberof BaseModule
     */
    constructor(bot) {
        this.bot = bot;
    }

    /**
     * If this module is enabled or not.
     *
     * @type {boolean}
     * @memberof BaseModule
     */
    enabled = true;

    /**
     * If this module should respond to all incoming messages or not.
     *
     * @type {boolean}
     * @memberof BaseModule
     */
    respondToAll = false;

    /**
     * The priority of this module. The lower the number the first it will be to run.
     *
     * @type {number}
     * @memberof BaseModule
     */
    priority = 0;

    /**
     * If this module can be run on bot messages.
     *
     * @type {boolean}
     * @memberof BaseModule
     */
    shouldRunOnBots = true;

    /**
     * Is users and roles mentioned in the bypass section of the config shouldn't trigger this module.
     *
     * @type {boolean}
     * @memberof BaseModule
     */
    usesBypassRules = false;

    /**
     * Checks to see if this message matches or not. If it returns true then we should act upon this message.
     *
     * @param {Message} message
     * @returns {boolean}
     * @memberof BaseModule
     */
    matches(message) {
        if (this.respondToAll) {
            return true;
        }

        if (message.system) {
            return false; // don't match system messages
        }

        if (message.author.bot) {
            return false; // don't respond to bot users
        }

        return this.pattern && message.cleanContent.match(this.pattern) !== null;
    }

    /**
     * This checks to see if this module should run for this message.
     *
     * @param {string} method
     * @param {Message} message
     * @param {Message|object} [updatedMessage={}]
     * @returns {boolean}
     * @memberof BaseModule
     */
    shouldRun(method, message, updatedMessage = {}) {
        let messageToActUpon = message;

        if (method === 'messageUpdate') {
            messageToActUpon = updatedMessage;
        }

        if (messageToActUpon.system) {
            return false;
        }

        if (messageToActUpon.author && messageToActUpon.author.bot && !this.shouldRunOnBots) {
            return false;
        }

        if (this.usesBypassRules) {
            if (
                config.bypass.users &&
                messageToActUpon.member &&
                messageToActUpon.member.user &&
                config.bypass.users.includes(
                    `${messageToActUpon.member.user.username}#${messageToActUpon.member.user.discriminator}`
                )
            ) {
                return false;
            }

            const isFromBypassedRole = config.bypass.roles.length && this.hasBypassRole(messageToActUpon);

            return !isFromBypassedRole;
        }

        return true;
    }

    /**
     * This adds a warning to a user. 2rd and 4th warning will result in a kick, 5th warning will result in a ban.
     *
     * @param {Message} message
     * @memberof BaseModule
     */
    async addWarningToUser(message) {
        if (message.author) {
            // eslint-disable-next-line prefer-const
            let user = (await database.findUserByID(message.author.id)) || {
                id: message.author.id,
                warnings: 0,
            };

            // in case of no or bad warnings information, set it to 0, ready to be incremented
            if (typeof user.warnings !== 'number' || Number.isNaN(user.warnings)) {
                user.warnings = 0;
            }

            user.warnings++;
            user.username = message.author.username;
            user.discriminator = message.author.discriminator;

            database.updateUserByID(message.author.id, user);

            // eslint-disable-next-line prefer-const
            let messageParts = [];

            messageParts.push(
                `**User:** ${message.author} (${message.author.username}#${message.author.discriminator})`
            );

            if (user.warnings >= 5) {
                messageParts.push(`**Action:** member banned for having ${user.warnings} warnings!`);
                message.member.ban({
                    days: 1,
                    reason: `Not following the rules and accumulating 5 warnings. Appeal at ${config.appeal_url}`,
                });
            } else if (user.warnings >= 3) {
                messageParts.push(`**Action:** member kicked for having ${user.warnings} warnings!`);
                message.member.kick('Not following the rules and accumulating 3 warnings');
            } else {
                messageParts.push(`**Action:** warning added for total of ${user.warnings} warnings!`);
            }

            this.sendMessageToModeratorLogsChannel(messageParts.join('\n'));
        }
    }

    /**
     * This will send the given message to the moderator logs channel.
     *
     * @param {string} message
     * @memberof BaseModule
     */
    sendMessageToModeratorLogsChannel(message) {
        const moderatorChannel = this.getModerationLogsChannel();

        if (moderatorChannel) {
            moderatorChannel.send(message);
        }
    }

    /**
     * This gets the channel object for the moderator channel in the config.
     *
     * @returns {TextChannel|VoiceChannel|null}
     * @memberof BaseModule
     */
    getModerationLogsChannel() {
        return this.bot.channels.find((channel) => {
            return channel.name === config.moderator_channel;
        });
    }

    /**
     * This will get all the channels which should be moderated.
     *
     * @returns {Collection<TextChannel|VoiceChannel>|null}
     * @memberof BaseModule
     */
    getModeratedChannels() {
        return this.bot.channels.filter((channel) => {
            return config.moderated_channels.indexOf(channel.name) !== -1;
        });
    }

    /**
     * Checks to see if the given channel is a moderated channel.
     *
     * @param {string} channel
     * @returns {boolean}
     * @memberof BaseModule
     */
    isAModeratedChannel(channel) {
        const moderatedChannels = this.getModeratedChannels();

        if (moderatedChannels && moderatedChannels.exists('name', channel)) {
            return true;
        }

        return false;
    }

    /**
     * This checks to see if the given message came from the passed in channel name.
     *
     * @param {Message} message
     * @param {string} channelName
     * @returns {boolean}
     * @memberof BaseModule
     */
    isFromChannel(message, channelName) {
        const wantedChannel = this.bot.channels.filter((channel) => {
            return channel.name === channelName;
        });

        if (!wantedChannel) {
            return false;
        }

        return message.channel.id === wantedChannel.id;
    }

    /**
     * This checks to see if the given message came from the passed in user.
     *
     * @param {Message} message
     * @param {string} username
     * @returns {boolean}
     * @memberof BaseModule
     */
    isFromUser(message, username) {
        return message.author && message.author.username === username;
    }

    /**
     * This will check the message to see if the author has one of the bypass roles.
     *
     * @param {Message}  message
     * @returns {boolean}
     * @memberof BaseModule
     */
    hasBypassRole(message) {
        if (!config.bypass.roles || !config.bypass.roles.length) {
            return false;
        }

        const filteredRoles = config.bypass.roles.filter((roleName) => {
            return message.member && message.member.roles && message.member.roles.exists('name', roleName);
        });

        return filteredRoles.length !== 0;
    }
}

export default BaseModule;
