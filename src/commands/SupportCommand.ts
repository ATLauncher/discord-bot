import got from 'got';
import * as Discord from 'discord.js';

import BaseCommand from './BaseCommand';
import { COLOURS } from '../constants/discord';

interface PacksSearchQuery {
    data: {
        searchPacks: [
            {
                name: string;
                websiteUrl?: string;
                supportUrl?: string;
                discordInviteUrl?: string;
            },
        ];
    };
}

class SupportCommand extends BaseCommand {
    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     */
    pattern = /^!support (\w+)/;

    /**
     * The description of what the command does.
     */
    description =
        'This will post a message with information on where to get support for a pack on ATLauncher. When passing in a pack, be sure to remove all spaces. It will search anything around it. For instance for SevTech: Ages, using "sevtech" or "tech" will work.';

    /**
     * The function that should be called when the event is fired.
     */
    async execute(message: Discord.Message) {
        const searchFor = message.cleanContent.match(this.pattern)?.[1];
        const { body } = await got.post<PacksSearchQuery>('https://api.atlauncher.com/v2/graphql', {
            json: {
                query: `{\n  searchPacks(first: 1, query: "${searchFor}", field: NAME) {\n    name\n      websiteUrl\n      supportUrl\n      discordInviteUrl\n    }\n}`,
            },
            responseType: 'json',
        });

        const packInfo = body?.data?.searchPacks?.[0];

        if (packInfo) {
            const user = message.mentions.users.first();
            const embed = new Discord.EmbedBuilder({
                title: `Where to get support for ${packInfo.name}`,
                description: `For support for ${packInfo.name} please visit their website at ${
                    packInfo.websiteUrl
                } or take a look at their support site at ${packInfo.supportUrl}.${
                    packInfo.discordInviteUrl ? ' Alternatively join their Discord below.' : ''
                }`,
                color: COLOURS.PRIMARY,
            });

            if (user) {
                await message.channel.send({ content: `${user}:`, embeds: [embed] });
            } else {
                await message.channel.send({ embeds: [embed] });
            }

            if (packInfo.discordInviteUrl) {
                await message.channel.send(packInfo.discordInviteUrl);
            }
        }

        message.delete();
    }
}

export default SupportCommand;
