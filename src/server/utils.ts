import type { Guild, GuildMember } from 'discord.js';

import type { Context } from '.';

export const getGuild = async (ctx: Context): Promise<Guild | undefined> => {
    let guild = ctx.bot.client.guilds.cache.first();

    if (!guild) {
        return;
    }

    if (!guild.available) {
        guild = await guild.fetch();
    }

    return guild;
};

export const getMember = (guild: Guild, user: string): GuildMember | undefined => {
    let member;

    console.log(user);

    if (user.includes('#')) {
        const [username, discriminator] = user.split('#');

        member = guild.members.cache.find(
            (member) => member.user.username === username && member.user.discriminator === discriminator,
        );
    } else {
        member = guild.members.cache.find((member) => member.id === user);
    }

    return member;
};
