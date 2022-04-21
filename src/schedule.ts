import config from 'config';
import schedule from 'node-schedule';

import type Bot from './Bot';
import prisma from './utils/prisma';
import logger from './utils/logger';
import { isAfter, subHours } from 'date-fns';

const removeJailedUsers = async (bot: Bot) => {
    logger.debug('Scheduler::removeJailedUsers - running');

    const usersToRelease = await prisma.user.findMany({ where: { jailedUntil: { lte: new Date() } } });

    if (usersToRelease.length) {
        logger.info(`Scheduler::removeJailedUsers - removing role from ${usersToRelease.length} users`);

        let guild = bot.client.guilds.cache.first();

        if (!guild) {
            return;
        }

        if (!guild.available) {
            guild = await guild.fetch();
        }

        for (const user of usersToRelease) {
            const member = guild.members.cache.find((member) => member.id === user.id);

            if (member) {
                await member.roles.remove(config.get<string>('roles.jailed'));
            }

            await prisma.user.update({ where: { id: user.id }, data: { jailedUntil: null } });
        }
    }
};

const archiveUnusedSupportThreads = async (bot: Bot) => {
    logger.debug('Scheduler::archiveUnusedSupportThreads - running');

    const minecraftSupportChannel = bot.getMinecraftSupportChannel();
    if (minecraftSupportChannel) {
        const threads = await minecraftSupportChannel.threads.fetchActive(false);
        threads.threads
            .filter((t) => t.messageCount === 1 && isAfter(subHours(new Date(), 1), t.createdAt))
            .forEach((t) => {
                logger.debug(`Archiving thread named ${t.name} as there are no messages after 1 hour.`);
                t.setArchived(true);
            });
    }

    const launcherSupportChannel = bot.getLauncherSupportChannel();
    if (launcherSupportChannel) {
        const threads = await launcherSupportChannel.threads.fetchActive(false);
        threads.threads
            .filter((t) => t.messageCount === 1 && isAfter(subHours(new Date(), 1), t.createdAt))
            .forEach((t) => {
                logger.debug(`Archiving thread named ${t.name} as there are no messages after 1 hour.`);
                t.setArchived(true);
            });
    }
};

export const startScheduler = (bot: Bot) => {
    logger.info('Scheduler started');

    schedule.scheduleJob('* * * * *', () => removeJailedUsers(bot));
    schedule.scheduleJob('*/10 * * * *', () => archiveUnusedSupportThreads(bot));
};
