import Router from '@koa/router';
import type { BaseContext } from 'koa';

const router = new Router();

router.get('/', (ctx: BaseContext) => {
    ctx.body = { ok: true };
});

export { router };
