import config from 'config';
import * as Sentry from '@sentry/node';

import Bot from './Bot';

import logger from './utils/logger';
import { isDevelopmentEnvironment, isProductionEnvironment } from './utils/env';

if (config.has('sentry.dsn')) {
    logger.debug('Setting up Sentry logging');
    Sentry.init({
        dsn: config.get<string>('sentry.dsn'),
        debug: isDevelopmentEnvironment(),
        environment: isProductionEnvironment() ? 'prod' : 'dev',
    });
}

const bot = new Bot();
bot.start();
