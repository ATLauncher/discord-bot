import config from './config';

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
     * This checks to see if the given message should be run or not.
     *
     * @param {Message} message
     * @returns {boolean}
     */
    shouldRun(message) {
        if (message.system) {
            return false;
        }

        if (message.author.bot && !this.shouldRunOnBots) {
            return false;
        }

        if (config.bypass.users.includes(message.member.user.username)) {
            return false;
        }

        const isFromBypassedRole = config.bypass.roles.filter((roleName) => {
            return this.isFromRole(message, roleName);
        }).length === 0;

        if (isFromBypassedRole) {
            return false;
        }

        return true;
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
     * @param {string} channelName
     * @returns {boolean}
     */
    isFromUser(message, username) {
        return message.author.username === username
    }

    /**
     * This checks to see if the given message came from a user with the passed in role.
     *
     * @param {Message} message
     * @param {string} roleName
     * @returns {boolean}
     */
    isFromRole(message, roleName) {
        return message.channel.guild.roles.exists('name', roleName)
    }
}

export default BaseModule;