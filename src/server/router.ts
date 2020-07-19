import Router from '@koa/router';
import * as Discord from 'discord.js';
import type { TextChannel } from 'discord.js';

import type { Context, ServerState, ServerContext } from './';

import * as database from '../utils/db';
import { getGuild, getMember, getChannel } from './utils';

const router = new Router<ServerState, ServerContext>();

router.get('/', (ctx: Context) => {
    ctx.body = { ok: true };
});

router.get('/stats', async (ctx: Context) => {
    const guild = await getGuild(ctx);

    if (!guild) {
        ctx.throw(500, 'failed to get the guild');
    }

    ctx.body = {
        uptime: ctx.bot.client.uptime,
        members: guild.memberCount,
        partnered: guild.partnered,
        premiumTier: guild.premiumTier,
        premiumSubscriptionCount: guild.premiumSubscriptionCount,
    };
});

router.get('/channel/:channel', async (ctx: Context) => {
    const guild = await getGuild(ctx);

    if (!guild) {
        ctx.throw(500, 'failed to get the guild');
    }

    const channel = await getChannel(guild, ctx.params.channel);

    if (!channel) {
        ctx.throw(404, 'no channel found');
    }

    ctx.body = channel;
});

router.post('/channel/:channel/send', async (ctx: Context) => {
    const guild = await getGuild(ctx);

    if (!guild) {
        ctx.throw(500, 'failed to get the guild');
    }

    const channel = (await getChannel(guild, ctx.params.channel)) as TextChannel;

    if (!channel) {
        ctx.throw(404, 'no channel found');
    }

    if (ctx.request.body.message) {
        await channel.send(ctx.request.body.message);
    }

    if (ctx.request.body.embeds) {
        for (const embed of ctx.request.body.embeds) {
            await channel.send(new Discord.MessageEmbed(embed as Discord.MessageEmbedOptions));
        }
    }

    ctx.status = 201;
});

router.get('/user/:user', async (ctx: Context) => {
    const guild = await getGuild(ctx);

    if (!guild) {
        ctx.throw(500, 'failed to get the guild');
    }

    const member = await getMember(guild, ctx.params.user);

    if (!member) {
        ctx.throw(404, 'no user found');
    }

    ctx.body = member;
});

router.get('/user/:user/roles', async (ctx: Context) => {
    const guild = await getGuild(ctx);

    if (!guild) {
        ctx.throw(500, 'failed to get the guild');
    }

    const member = await getMember(guild, ctx.params.user);

    if (!member) {
        ctx.throw(404, 'no user found');
    }

    ctx.body = member.roles.cache.toJSON();
});

router.post('/user/:user/roles', async (ctx: Context) => {
    const guild = await getGuild(ctx);

    if (!guild) {
        ctx.throw(500, 'failed to get the guild');
    }

    const member = await getMember(guild, ctx.params.user);

    if (!member) {
        ctx.throw(404, 'no user found');
    }

    const { role } = ctx.request.body;

    if (member.roles.cache.has(role)) {
        ctx.status = 204;
        return;
    }

    await member.roles.add(role);

    ctx.status = 201;
});

router.delete('/user/:user/roles/:role', async (ctx: Context) => {
    const guild = await getGuild(ctx);

    if (!guild) {
        ctx.throw(500, 'failed to get the guild');
    }

    const member = await getMember(guild, ctx.params.user);

    if (!member) {
        ctx.throw(404, 'no user found');
    }

    await member.roles.remove(ctx.params.role);

    ctx.status = 204;
});

router.get('/user/:user/messages', async (ctx: Context) => {
    const guild = await getGuild(ctx);

    if (!guild) {
        ctx.throw(500, 'failed to get the guild');
    }

    const member = await getMember(guild, ctx.params.user);

    if (!member) {
        ctx.throw(404, 'no user found');
    }

    ctx.body = await database.databases.messages.find({ userID: member.user.id }).sort({ createdAt: -1 });
});

router.post('/user/:user/kick', async (ctx: Context) => {
    const guild = await getGuild(ctx);

    if (!guild) {
        ctx.throw(500, 'failed to get the guild');
    }

    const member = await getMember(guild, ctx.params.user);

    if (!member) {
        ctx.throw(404, 'no user found');
    }

    if (!member.kickable) {
        ctx.throw(406, 'user is not kickable');
    }

    await member.kick(ctx.request.body.reason);

    ctx.status = 204;
});

router.post('/user/:user/ban', async (ctx: Context) => {
    const guild = await getGuild(ctx);

    if (!guild) {
        ctx.throw(500, 'failed to get the guild');
    }

    const member = await getMember(guild, ctx.params.user);

    if (!member) {
        ctx.throw(404, 'no user found');
    }

    if (!member.bannable) {
        ctx.throw(406, 'user is not bannable');
    }

    await member.ban({
        days: ctx.request.body.days || 1,
        reason: ctx.request.body.reason,
    });

    ctx.status = 204;
});

router.post('/user/:user/send', async (ctx: Context) => {
    const guild = await getGuild(ctx);

    if (!guild) {
        ctx.throw(500, 'failed to get the guild');
    }

    const member = await getMember(guild, ctx.params.user);

    if (!member) {
        ctx.throw(404, 'no user found');
    }

    if (ctx.request.body.message) {
        await member.send(ctx.request.body.message);
    }

    if (ctx.request.body.embeds) {
        for (const embed of ctx.request.body.embeds) {
            await member.send(new Discord.MessageEmbed(embed as Discord.MessageEmbedOptions));
        }
    }

    ctx.status = 201;
});

router.get('/db/users', async (ctx: Context) => {
    ctx.body = await database.databases.users.find({}).sort({ updatedAt: -1 });
});

router.get('/db/messages', async (ctx: Context) => {
    ctx.body = await database.databases.messages.find({}).sort({ updatedAt: -1 }).limit(100);
});

export { router };
