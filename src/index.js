import config from 'config';
import * as Sentry from '@sentry/node';

import Bot from './Bot';
import logger from './logger';

if (config.has('sentry.dsn')) {
    Sentry.init({ dsn: config.get('sentry.dsn') });
}

const bot = new Bot();

bot.start();

const catchThemErrors = (error) => {
    Sentry.captureException(error);
    logger.error(typeof error.message === 'string' ? error.message : JSON.stringify(error.message));

    process.exit(1);
};

process.on('uncaughtException', catchThemErrors);
process.on('unhandledRejection', catchThemErrors);
