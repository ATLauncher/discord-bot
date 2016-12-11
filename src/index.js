import 'babel-polyfill';

import Bot from './Bot';

const bot = new Bot();

bot.start();

process.on('uncaughtException', function (error) {
    console.error('uncaughtException', error || '');
});

process.on('unhandledRejection', function (reason, p) {
    console.error('unhandledRejection', reason || '', p || '');
});