import config from 'config';
import * as Discord from 'discord.js';

import * as database from './utils/db';
import { COLOURS } from './constants/discord';

import type { User as DBUser } from './utils/db';
import Bot from './Bot';
import { addMinutes } from 'date-fns';

/**
 * This is the base module class. A module is either a command or a watcher.
 */
abstract class BaseModule {
    /**
     * The instance of the Bot client.
     */
    bot: Bot;

    /**
     * The events that this module should react to.
     */
    abstract methods: Array<keyof Discord.ClientEvents>;

    /**
     * If this module is enabled or not.
     */
    enabled = true;

    /**
     * If this module should respond to all incoming messages or not.
     */
    respondToAll = false;

    /**
     * The priority of this module. The lower the number the first it will be to run.
     */
    priority = 0;

    /**
     * If this module can be run on bot messages.
     */
    shouldRunOnBots = true;

    /**
     * Is users and roles mentioned in the bypass section of the config shouldn't trigger this module.
     */
    usesBypassRules = false;

    /**
     * The permissions the user requires in order to use this command.
     */
    permissions: Discord.PermissionResolvable[] = [];

    /**
     * Creates an instance of BaseModule.
     */
    constructor(bot: Bot) {
        this.bot = bot;
    }

    /**
     * The action to take when this module is invoked.
     */
    abstract action(
        action: keyof Discord.ClientEvents,
        ...args: Discord.ClientEvents[keyof Discord.ClientEvents]
    ): Promise<void>;

    /**
     * This checks to see if this module should run for this message.
     */
    async shouldRun(
        method: keyof Discord.ClientEvents,
        message: Discord.Message,
        updatedMessage?: Discord.Message,
    ): Promise<boolean> {
        let messageToActUpon = message;

        if (method === 'messageUpdate' && updatedMessage) {
            messageToActUpon = updatedMessage;
        }

        if (messageToActUpon.system) {
            return false;
        }

        if (messageToActUpon.author && messageToActUpon.author.bot && !this.shouldRunOnBots) {
            return false;
        }

        if (
            this.permissions.length &&
            !this.permissions.every((perm) => messageToActUpon.member?.hasPermission(perm))
        ) {
            await messageToActUpon.delete();

            return false;
        }

        if (this.usesBypassRules) {
            return !this.hasBypassRole(message);
        }

        return true;
    }

    /**
     * This adds a warning to a user. 3rd and 4th warning will result in a kick, 5th warning will result in a ban.
     */
    async addWarningToUser(message: Discord.Message | Discord.PartialMessage): Promise<void> {
        if (message.author) {
            let user: DBUser = (await database.findUserByID(message.author.id)) || {
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

            this.sendEmbedToModeratorLogsChannel(
                new Discord.MessageEmbed()
                    .setTitle('Warning added')
                    .setColor(COLOURS.YELLOW)
                    .setTimestamp(new Date())
                    .addField(
                        'User',
                        `${message.author} (${message.author.username}#${message.author.discriminator})`,
                        true,
                    )
                    .addField('Warnings', user.warnings, true),
            );

            if (user.warnings >= 5) {
                message.member?.ban({
                    days: 1,
                    reason: 'Not following the rules and accumulating 5 warnings',
                });
            } else if (user.warnings >= 3) {
                message.member?.kick('Not following the rules and accumulating 3 warnings.');

                this.sendEmbedToModeratorLogsChannel(
                    new Discord.MessageEmbed()
                        .setTitle('User kicked')
                        .setColor(COLOURS.RED)
                        .setTimestamp(new Date())
                        .addField(
                            'User',
                            `${message.author} (${message.author.username}#${message.author.discriminator})`,
                        ),
                );
            } else if (user.warnings >= 2) {
                if (message.member) {
                    this.addUserToJail(message.member);
                }
            }
        }
    }

    /**
     * This adds a the user to the jail role.
     */
    async addUserToJail(member: Discord.GuildMember): Promise<void> {
        let user: DBUser = (await database.findUserByID(member.user.id)) || {
            id: member.user.id,
        };

        user.jailedUntil = addMinutes(new Date(), 5);
        user.username = member.user.username;
        user.discriminator = member.user.discriminator;

        database.updateUserByID(member.user.id, user);

        member.roles.add(config.get<string>('roles.jailed'));

        this.sendEmbedToModeratorLogsChannel(
            new Discord.MessageEmbed()
                .setTitle('User jailed')
                .setColor(COLOURS.YELLOW)
                .setTimestamp(new Date())
                .addField('User', `${member.user} (${member.user.username}#${member.user.discriminator})`, true),
        );
    }

    /**
     * Checks to see if the user has seen the TLauncher warning message.
     */
    async hasUserSeenTLauncherMessage(message: Discord.Message | Discord.PartialMessage): Promise<boolean> {
        if (message.author) {
            let user: DBUser = (await database.findUserByID(message.author.id)) || {
                id: message.author.id,
                hasSeenTLauncherMessage: false,
            };

            return user.hasSeenTLauncherMessage;
        }

        return false;
    }

    /**
     * This adds a flag to a user that they've seen the message regarding support for TLauncher. This is so we don't
     * show it more than once, just incase the bot is not understanding correctly.
     */
    async addHasSeenTLauncherMessageToUser(message: Discord.Message | Discord.PartialMessage): Promise<void> {
        if (message.author) {
            let user = (await database.findUserByID(message.author.id)) || {
                id: message.author.id,
                hasSeenTLauncherMessage: false,
            };

            user.hasSeenTLauncherMessage = true;
            user.username = message.author.username;
            user.discriminator = message.author.discriminator;

            database.updateUserByID(message.author.id, user);

            this.sendEmbedToModeratorLogsChannel(
                new Discord.MessageEmbed()
                    .setTitle('TLauncher warning shown to user')
                    .setColor(COLOURS.YELLOW)
                    .setTimestamp(new Date())
                    .addField(
                        'User',
                        `${message.author} (${message.author.username}#${message.author.discriminator})`,
                        true,
                    )
                    .addField('Message', `\`\`\`${message?.cleanContent?.replace(/`/g, '\\`')}\`\`\``),
            );
        }
    }

    /**
     * This adds a flag to a user that they've been sent the join message.
     */
    async addHasBeenSentJoinMessage(member: Discord.GuildMember | Discord.PartialGuildMember): Promise<void> {
        if (member.user) {
            let user = (await database.findUserByID(member.id)) || {
                id: member.id,
                hasBeenSentJoinMessage: false,
            };

            user.hasBeenSentJoinMessage = true;
            user.username = member.user.username;
            user.discriminator = member.user.discriminator;

            database.updateUserByID(member.id, user);
        }
    }

    /**
     * Checks to see if the user has sent the join message.
     */
    async hasUserBeenSentJoinMessage(member: Discord.GuildMember | Discord.PartialGuildMember): Promise<boolean> {
        let user: DBUser = (await database.findUserByID(member.id)) || {
            id: member.id,
            hasBeenSentJoinMessage: false,
        };

        return user.hasBeenSentJoinMessage;
    }

    /**
     * This will send the given message to the moderator logs channel.
     */
    sendMessageToModeratorLogsChannel(message: Discord.StringResolvable): void {
        const moderatorChannel = this.getModerationLogsChannel();

        if (moderatorChannel) {
            moderatorChannel.send(message);
        }
    }

    /**
     * This will send the given embed message to the moderator logs channel.
     */
    sendEmbedToModeratorLogsChannel(embed: Discord.MessageEmbed): void {
        const moderatorChannel = this.getModerationLogsChannel();

        if (moderatorChannel) {
            moderatorChannel.send({ embed });
        }
    }

    /**
     * This gets the channel object for the moderator channel in the config.
     */
    getModerationLogsChannel(): Discord.TextChannel | undefined {
        return this.bot.client.channels.cache.find(
            ({ id }) => id === config.get<string>('channels.moderationLogs'),
        ) as Discord.TextChannel;
    }

    /**
     * Checks to see if the given channel is a moderated channel.
     */
    isAModeratedChannel(channel: Discord.Channel): boolean {
        return config.get<string[]>('moderatedChannels')?.some((id) => id === channel.id);
    }

    /**
     * This will check the message to see if the author has one of the bypass roles.
     */
    hasBypassRole(message: Discord.Message) {
        const roles = config.get<string[]>('bypass.roles');

        if (roles?.length) {
            return message.member?.roles.cache.some(({ id }) => roles.some((roleId) => roleId === id));
        }

        return false;
    }
}

export default BaseModule;
