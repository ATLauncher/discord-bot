import config from 'config';
import * as Sentry from '@sentry/node';

import Bot from './Bot';
import logger from './logger';

if (config.has('sentry.dsn')) {
    Sentry.init({ dsn: config.get('sentry.dsn') });
}

const bot = new Bot();

bot.start();

process.on('uncaughtException', (error) => {
    logger.error(error.message);

    process.exit(1);
});

process.on('unhandledRejection', (event) => {
    logger.error(event.message);

    process.exit(1);
});
