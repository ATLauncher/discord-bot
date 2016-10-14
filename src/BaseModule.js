import config from './config';

import database from './db';

/**
 * This is the base module. A module is either a command or a watcher.
 */
class BaseModule {
    constructor(bot) {
        this.bot = bot;
    }

    /**
     * If this module is enabled or not.
     *
     * @type {boolean}
     */
    enabled = true;

    /**
     * If this module should respond to all incoming messages or not.
     *
     * @type {boolean}
     */
    respondToAll = false;

    /**
     * The priority of this module. The lower the number the first it will be to run.
     *
     * @type {number}
     */
    priority = 0;

    /**
     * If this module can be run on bot messages.
     *
     * @type {boolean}
     */
    shouldRunOnBots = true;

    /**
     * Is users and roles mentioned in the bypass section of the config shouldn't trigger this module.
     *
     * @type {boolean}
     */
    usesBypassRules = false;

    /**
     * Checks to see if this message matches or not. If it returns true then we should act upon this message.
     *
     * @param {Message} message
     * @returns {boolean}
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
     * @param {Message} updatedMessage
     * @returns {boolean}
     */
    shouldRun(method, message, updatedMessage = {}) {
        if (method === 'messageUpdate') {
            message = updatedMessage;
        }

        if (message.system) {
            return false;
        }

        if (message.author.bot && !this.shouldRunOnBots) {
            return false;
        }

        if (this.usesBypassRules) {
            if (config.bypass.users && config.bypass.users.includes(`${message.member.user.username}#${message.member.user.discriminator}`)) {
                return false;
            }

            const isFromBypassedRole = config.bypass.roles.length && this.hasBypassRole(message);

            return !isFromBypassedRole;
        }

        return true;
    }

    /**
     * This adds a warning to a user. 2rd and 4th warning will result in a kick, 5th warning will result in a ban.
     *
     * @param {Message} message
     */
    addWarningToUser(message) {
        database.users.findOne({id: message.author.id}, (err, doc) => {
            if (!err) {
                let user = doc;

                if (!user) {
                    user = {
                        id: message.author.id,
                        warnings: 1,
                        warningMessages: [
                            {
                                id: message.id,
                                content: message.cleanContent,
                                created_at: new Date()
                            }
                        ]
                    };
                } else {
                    user.warnings++;

                    if (!user.warningMessages) {
                        user.warningMessages = [];
                    }

                    user.warningMessages.push({
                        id: message.id,
                        content: message.cleanContent,
                        created_at: new Date()
                    });
                }

                user.username = message.author.username;
                user.discriminator = message.author.discriminator;

                users.update({
                    id: message.author.id
                }, user, {
                    upsert: true
                });

                if (user.warnings >= 5) {
                    this.sendMessageToModeratorLogsChannel(`**User:** ${message.author} (${message.author.username}#${message.author.discriminator})\n**Action:** member banned for having ${user.warnings} warnings!`);
                    message.member.ban();
                } else if (user.warnings >= 3) {
                    this.sendMessageToModeratorLogsChannel(`**User:** ${message.author} (${message.author.username}#${message.author.discriminator})\n**Action:** member kicked for having ${user.warnings} warnings!`);
                    message.member.kick();
                } else {
                    this.sendMessageToModeratorLogsChannel(`**User:** ${message.author} (${message.author.username}#${message.author.discriminator})\n**Action:** warning added for total of ${user.warnings} warnings!`);
                }
            }
        });
    }

    sendMessageToModeratorLogsChannel(message) {
        const moderatorChannel = this.getModerationLogsChannel();

        if (moderatorChannel) {
            moderatorChannel.sendMessage(message);
        }
    }

    /**
     * This gets the channel object for the moderator channel in the config.
     *
     * @returns {TextChannel|VoiceChannel|null}
     */
    getModerationLogsChannel() {
        return this.bot.channels.find((channel) => {
            return channel.name === config.moderator_channel
        });
    }

    /**
     * This will get all the channels which should be moderated.
     *
     * @returns {Collection<TextChannel|VoiceChannel>|null}
     */
    getModeratedChannels() {
        return this.bot.channels.filter((channel) => {
            return config.moderated_channels.indexOf(channel.name) !== -1
        });
    }

    /**
     * Checks to see if the given channel is a moderated channel.
     *
     * @param {string} channel
     * @returns {boolean}
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
     */
    isFromUser(message, username) {
        return message.author.username === username
    }

    /**
     * This will check the message to see if the author has one of the bypass roles.
     *
     * @param {Message}  message
     * @returns {boolean}
     */
    hasBypassRole(message) {
        if (!config.bypass.roles || !config.bypass.roles.length) {
            return false;
        }

        return config.bypass.roles.filter((roleName) => {
                return message.member.roles.exists('name', roleName);
            }).length !== 0;
    }
}

export default BaseModule;