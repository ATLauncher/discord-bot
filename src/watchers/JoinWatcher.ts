import config from 'config';
import * as Discord from 'discord.js';

import BaseWatcher from './BaseWatcher';
import logger from '../utils/logger';
import { isProductionEnvironment } from '../utils/env';

/**
 * This watcher checks for people using bad tags such as @here, @all and @everyone.
 */
class JoinWatcher extends BaseWatcher {
    /**
     * The methods this watcher should listen on.
     */
    methods: Array<keyof Discord.ClientEvents> = ['guildMemberAdd'];

    /**
     * Only enable this on production so that users are not getting double messages on join while testing the bot.
     */
    enabled = isProductionEnvironment();

    /**
     * The function that should be called when the event is fired.
     */
    async action(method: keyof Discord.ClientEvents, ...args: Discord.ClientEvents['guildMemberAdd']) {
        const member = args[0];

        if (!(await this.hasUserBeenSentJoinMessage(member))) {
            logger.debug(`Member ${member.displayName} (${member.id}) joined for the first time`);
            this.addHasBeenSentJoinMessage(member);

            await member.send(
                `Thanks for joining the ATLauncher Discord server. I'm ${this.bot.client.user?.username}, I'm here to help run the server.

Below are some helpful links that you should look over to become familiar with the server.`,
            );

            const rulesChannel = this.bot.client.channels.cache.find(
                (channel) => channel.id === config.get('channels.rules'),
            );

            await member.send(
                new Discord.MessageEmbed({
                    title: 'Read The Rules',
                    description:
                        "First things first, reading the rules is important to making sure everything is running smoothly. We will warn you if you break any of the rules, and if you get too many warnings, I'll automatically ban you in order to keep the order within the server. If you do end up getting banned, please feel free to [appeal the ban here](https://atl.pw/discord-ban-appeal).",
                    color: 16711680,
                    fields: [
                        {
                            name: 'Find the rules here',
                            value: `[#rules](https://discord.com/channels/${member.guild.id}/${rulesChannel?.id})`,
                        },
                    ],
                }),
            );

            const announcementsChannel = this.bot.client.channels.cache.find(
                (channel) => channel.id === config.get('channels.announcements'),
            );

            await member.send(
                new Discord.MessageEmbed({
                    title: 'Check The Announcements',
                    description:
                        "The announcement channel is where we post any important updates around ATLauncher. If you're facing issues with ATLauncher, the announcement channel should be the first place to look for updates.",
                    color: 65280,
                    fields: [
                        {
                            name: 'Check them out here',
                            value: `[#announcements](https://discord.com/channels/${member.guild.id}/${announcementsChannel?.id})`,
                        },
                    ],
                }),
            );

            const minecraftSupportChannel = this.bot.client.channels.cache.find(
                (channel) => channel.id === config.get('channels.minecraftSupport'),
            );

            const launcherSupportChannel = this.bot.client.channels.cache.find(
                (channel) => channel.id === config.get('channels.launcherSupport'),
            );

            await member.send(
                new Discord.MessageEmbed({
                    title: 'Where To Get Help',
                    description:
                        "It's important to use the right channel when asking for help or chatting with others. **Whenever you post an issue, make sure you provide logs**. By not providing logs or describing your issue in detail, you may not get help.\n\nAlso be aware that this server is run by people who volunteer their time to help others with issues. You may not get a response straight away, it may take 5 minutes, an hour, 4 hours or even a day for your message to get a response, so please have patience. Also please don't message people or ping people asking for help, as your message will be deleted and you may get banned.",
                    color: 255,
                    fields: [
                        {
                            name: 'For Help With Minecraft',
                            value: `[#minecraft-support](https://discord.com/channels/${member.guild.id}/${minecraftSupportChannel?.id})`,
                            inline: true,
                        },
                        {
                            name: 'For Help With The Launcher',
                            value: `[#launcher-support](https://discord.com/channels/${member.guild.id}/${launcherSupportChannel?.id})`,
                            inline: true,
                        },
                    ],
                }),
            );
        }
    }
}

export default JoinWatcher;
