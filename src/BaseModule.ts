import config from 'config';
import { addMinutes, isAfter, secondsInDay, subMinutes } from 'date-fns';
import * as Discord from 'discord.js';

import Bot from './Bot';
import prisma from './utils/prisma';
import { COLOURS } from './constants/discord';

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
            !this.permissions.every((perm) => messageToActUpon.member?.permissions?.has(perm))
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
    async addWarningToUser(message: Discord.Message | Discord.PartialMessage, reason = 'None given'): Promise<void> {
        if (message.author && !message.author.bot) {
            const user = await prisma.user.upsert({
                where: {
                    id: message.author.id,
                },
                create: {
                    id: message.author.id,
                    username: message.author.username,
                    discriminator: message.author.discriminator,
                },
                update: {
                    username: message.author.username,
                    discriminator: message.author.discriminator,
                    warnings: {
                        increment: 1,
                    },
                },
            });

            this.sendEmbedToModeratorLogsChannel(
                new Discord.EmbedBuilder()
                    .setTitle('Warning added')
                    .setColor(COLOURS.YELLOW)
                    .setTimestamp(new Date())
                    .addFields([
                        {
                            name: 'User',
                            value: `${message.author} (${message.author.username}#${message.author.discriminator})`,
                            inline: true,
                        },
                        {
                            name: 'Warnings',
                            value: String(user.warnings),
                            inline: true,
                        },
                        {
                            name: 'Reason',
                            value: reason,
                            inline: false,
                        },
                    ]),
            );

            if (user.warnings >= 5) {
                message.member?.ban({
                    deleteMessageSeconds: 1 * secondsInDay,
                    reason: 'Not following the rules and accumulating 5 warnings',
                });
            } else if (user.warnings >= 3) {
                message.member?.kick('Not following the rules and accumulating 3 warnings.');

                this.sendEmbedToModeratorLogsChannel(
                    new Discord.EmbedBuilder()
                        .setTitle('User kicked')
                        .setColor(COLOURS.RED)
                        .setTimestamp(new Date())
                        .addFields([
                            {
                                name: 'User',
                                value: `${message.author} (${message.author.username}#${message.author.discriminator})`,
                            },
                        ]),
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
        await prisma.user.upsert({
            where: {
                id: member.user.id,
            },
            create: {
                id: member.user.id,
                username: member.user.username,
                discriminator: member.user.discriminator,
                jailedUntil: addMinutes(new Date(), 5),
            },
            update: {
                jailedUntil: addMinutes(new Date(), 5),
            },
        });

        member.roles.add(config.get<string>('roles.jailed'));

        this.sendEmbedToModeratorLogsChannel(
            new Discord.EmbedBuilder()
                .setTitle('User jailed')
                .setColor(COLOURS.YELLOW)
                .setTimestamp(new Date())
                .addFields([
                    {
                        name: 'User',
                        value: `${member.user} (${member.user.username}#${member.user.discriminator})`,
                        inline: true,
                    },
                ]),
        );
    }

    /**
     * Only allow people to create support threads every 5 minutes.
     */
    async canCreateNewSupportThread(member: Discord.User): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: {
                id: member.id,
            },
        });

        if (!user || !user.lastSupportThreadCreation) {
            return true;
        }

        return isAfter(new Date(), addMinutes(user.lastSupportThreadCreation, 5));
    }

    /**
     * Checks to see if the user has seen the TLauncher warning message.
     */
    async hasUserSeenTLauncherMessage(message: Discord.Message | Discord.PartialMessage): Promise<boolean> {
        if (message.author) {
            const user = await prisma.user.findUnique({
                where: {
                    id: message.author.id,
                },
            });

            return user?.hasSeenTLauncherMessage ?? false;
        }

        return false;
    }

    /**
     * This adds a flag to a user that they've seen the message regarding support for TLauncher. This is so we don't
     * show it more than once, just incase the bot is not understanding correctly.
     */
    async addHasSeenTLauncherMessageToUser(message: Discord.Message | Discord.PartialMessage): Promise<void> {
        if (message.author && !message.author.bot) {
            await prisma.user.upsert({
                where: {
                    id: message.author.id,
                },
                create: {
                    id: message.author.id,
                    username: message.author.username,
                    discriminator: message.author.discriminator,
                    hasSeenTLauncherMessage: true,
                },
                update: {
                    username: message.author.username,
                    discriminator: message.author.discriminator,
                    hasSeenTLauncherMessage: true,
                },
            });

            this.sendEmbedToModeratorLogsChannel(
                new Discord.EmbedBuilder()
                    .setTitle('TLauncher warning shown to user')
                    .setColor(COLOURS.YELLOW)
                    .setTimestamp(new Date())
                    .addFields([
                        {
                            name: 'User',
                            value: `${message.author} (${message.author.username}#${message.author.discriminator})`,
                            inline: true,
                        },
                        {
                            name: 'Message',
                            value: `\`\`\`${message?.cleanContent?.replace(/`/g, '\\`')}\`\`\``,
                        },
                    ]),
            );
        }
    }

    /**
     * This adds a flag to a user that they've been sent the join message.
     */
    async addHasBeenSentJoinMessage(member: Discord.GuildMember | Discord.PartialGuildMember): Promise<void> {
        if (member.user) {
            await prisma.user.upsert({
                where: {
                    id: member.user.id,
                },
                create: {
                    id: member.user.id,
                    username: member.user.username,
                    discriminator: member.user.discriminator,
                },
                update: {
                    username: member.user.username,
                    discriminator: member.user.discriminator,
                    hasBeenSentJoinMessage: true,
                },
            });
        }
    }

    /**
     * Checks to see if the user has sent the join message.
     */
    async hasUserBeenSentJoinMessage(member: Discord.GuildMember | Discord.PartialGuildMember): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: {
                id: member.id,
            },
        });

        return user?.hasBeenSentJoinMessage ?? false;
    }

    /**
     * This will send the given message to the moderator logs channel.
     */
    sendMessageToModeratorLogsChannel(message: string): void {
        const moderatorChannel = this.getModerationLogsChannel();

        if (moderatorChannel) {
            moderatorChannel.send(message);
        }
    }

    /**
     * This will send the given embed message to the moderator logs channel.
     */
    sendEmbedToModeratorLogsChannel(embed: Discord.EmbedBuilder): void {
        const moderatorChannel = this.getModerationLogsChannel();

        if (moderatorChannel) {
            moderatorChannel.send({ embeds: [embed] });
        }
    }

    /**
     * This gets the channel object for the moderator channel in the config.
     */
    getModerationLogsChannel(): Discord.TextChannel | undefined {
        return this.bot.client.channels.cache.get(config.get<string>('channels.moderationLogs')) as Discord.TextChannel;
    }

    /**
     * This gets the channel object for the minecraft support channel in the config.
     */
    getMinecraftSupportChannel(): Discord.TextChannel | undefined {
        return this.bot.getMinecraftSupportChannel();
    }

    /**
     * This gets the channel object for the launcher support channel in the config.
     */
    getLauncherSupportChannel(): Discord.TextChannel | undefined {
        return this.bot.getLauncherSupportChannel();
    }

    /**
     * Checks to see if the given channel is a moderated channel.
     */
    isAModeratedChannel(channel: Discord.TextBasedChannel): boolean {
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
