import Router from '@koa/router';
import type { TextChannel } from 'discord.js';

import type { Context, ServerState, ServerContext } from './';

import * as database from '../utils/db';
import { getGuild, getMember } from './utils';

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

    const { role, announce } = ctx.request.body;

    if (member.roles.cache.has(role)) {
        ctx.status = 204;
        return;
    }

    await member.roles.add(role);

    if (announce) {
        const broadcastChannel = ctx.bot.client.channels.cache.find(
            (channel) => channel.id === announce,
        ) as TextChannel;

        if (broadcastChannel) {
            await broadcastChannel.send(`Welcome ${member}!`);
        }
    }

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

router.get('/db/users', async (ctx: Context) => {
    ctx.body = await database.databases.users.find({}).sort({ updatedAt: -1 });
});

router.get('/db/messages', async (ctx: Context) => {
    ctx.body = await database.databases.messages.find({}).sort({ updatedAt: -1 }).limit(100);
});

export { router };
