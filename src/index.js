import config from 'config';
import * as Sentry from '@sentry/node';

import Bot from './Bot';
import logger from './logger';
import { isDevelopmentEnvironment, isProductionEnvironment } from './utils';

if (config.has('sentry.dsn')) {
    logger.debug('Setting up Sentry logging');
    Sentry.init({
        dsn: config.get('sentry.dsn'),
        debug: isDevelopmentEnvironment(),
        environment: isProductionEnvironment() ? 'prod' : 'dev',
    });
}

const bot = new Bot();

bot.start();
