import Router from '@koa/router';

import type { Context, ServerState, ServerContext } from './';

import * as database from '../utils/db';
import { TextChannel } from 'discord.js';

const router = new Router<ServerState, ServerContext>();

router.get('/', (ctx: Context) => {
    ctx.body = { ok: true };
});

router.get('/stats', async (ctx: Context) => {
    let guild = ctx.bot.client.guilds.cache.first();

    if (!guild) {
        ctx.throw(500, 'failed to get the guild');
        return;
    }

    if (!guild.available) {
        guild = await guild.fetch();
    }

    ctx.body = {
        uptime: ctx.bot.client.uptime,
        members: guild.memberCount,
        partnered: guild.partnered,
        premiumTier: guild.premiumTier,
        premiumSubscriptionCount: guild.premiumSubscriptionCount,
    };
});

router.get('/user/by-id/:id', async (ctx: Context) => {
    let guild = ctx.bot.client.guilds.cache.first();

    if (!guild) {
        ctx.throw(500, 'failed to get the guild');
        return;
    }

    if (!guild.available) {
        guild = await guild.fetch();
    }

    const member = guild.members.cache.find((member) => member.id === ctx.params.id);

    if (!member) {
        ctx.throw(404, 'no user found with that id');
        return;
    }

    ctx.body = {
        ...member,
    };
});

router.get('/user/by-name/:name', async (ctx: Context) => {
    let guild = ctx.bot.client.guilds.cache.first();

    if (!guild) {
        ctx.throw(500, 'failed to get the guild');
        return;
    }

    if (!guild.available) {
        guild = await guild.fetch();
    }

    const [username, discriminator] = ctx.params.name.split('#');

    let member = guild.members.cache.find(
        (member) => member.user.username === username && member.user.discriminator === discriminator,
    );

    if (!member) {
        ctx.throw(404, 'no user found with that name');
        return;
    }

    ctx.body = {
        ...member,
    };
});

router.get('/user/by-name/:name/add-role/:role/:channel?', async (ctx: Context) => {
    let guild = ctx.bot.client.guilds.cache.first();

    if (!guild) {
        ctx.throw(500, 'failed to get the guild');
        return;
    }

    if (!guild.available) {
        guild = await guild.fetch();
    }

    const [username, discriminator] = ctx.params.name.split('#');

    let member = guild.members.cache.find(
        (member) => member.user.username === username && member.user.discriminator === discriminator,
    );

    if (!member) {
        ctx.throw(404, 'no user found with that name');
        return;
    }

    await member.roles.add(ctx.params.role);

    if (ctx.params.channel) {
        const broadcastChannel = ctx.bot.client.channels.cache.find(
            (channel) => channel.id === ctx.params.channel,
        ) as TextChannel;

        if (broadcastChannel) {
            await broadcastChannel.send(`Welcome ${member}!`);
        }
    }

    ctx.status = 202;
});

router.get('/user/by-name/:name/remove-role/:role', async (ctx: Context) => {
    let guild = ctx.bot.client.guilds.cache.first();

    if (!guild) {
        ctx.throw(500, 'failed to get the guild');
        return;
    }

    if (!guild.available) {
        guild = await guild.fetch();
    }

    const [username, discriminator] = ctx.params.name.split('#');

    let member = guild.members.cache.find(
        (member) => member.user.username === username && member.user.discriminator === discriminator,
    );

    if (!member) {
        ctx.throw(404, 'no user found with that name');
        return;
    }

    await member.roles.remove(ctx.params.role);

    ctx.status = 202;
});

router.get('/users', async (ctx: Context) => {
    ctx.body = await database.databases.users.find({}).sort({ updatedAt: -1 });
});

router.get('/messages', async (ctx: Context) => {
    ctx.body = await database.databases.messages.find({}).sort({ updatedAt: -1 }).limit(100);
});

export { router };
