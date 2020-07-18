import Koa, { Context } from 'koa';
import config from 'config';
import * as Sentry from '@sentry/node';
import bodyParser from 'koa-bodyparser';

import Bot from './Bot';

import { router } from './router';

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

const app = new Koa();
app.use((ctx: Context, next) => {
    if (!ctx.request.header.authorization) {
        ctx.throw(400, 'token_invalid', {
            message: `api key must be provided`,
        });
    }

    const [, apiKey] = (ctx.request.header.authorization as string).split(' ', 2);

    if (apiKey !== config.get<string>('server.apiKey')) {
        ctx.throw(400, 'token_invalid', {
            message: `api key invalid`,
        });
    }

    return next();
});
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());
app.listen(config.get<number>('server.port'));
logger.debug(`Server running on port ${config.get<number>('server.port')}`);
