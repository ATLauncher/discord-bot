import Koa from 'koa';
import config from 'config';
import bodyParser from 'koa-bodyparser';
import type { ParameterizedContext, DefaultState, DefaultContext } from 'koa';

import { router } from './router';

import type Bot from '../Bot';

import logger from '../utils/logger';

export type ServerState = DefaultState;
export type ServerContext = DefaultContext & { bot: Bot };
export type Context = ParameterizedContext<ServerState, ServerContext>;

export const startServer = (bot: Bot) => {
    const app = new Koa();

    app.context.bot = bot;

    app.use((ctx: ServerContext, next) => {
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
};
