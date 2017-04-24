import 'babel-polyfill';

import Bot from './Bot';

const bot = new Bot();

bot.start();

process.on('uncaughtException', (error) => {
    // eslint-disable-next-line no-console
    console.error('uncaughtException', error || '');
});

process.on('unhandledRejection', (reason, p) => {
    // eslint-disable-next-line no-console
    console.error('unhandledRejection', reason || '', p || '');
});
