import Bot from './Bot';

const bot = new Bot();

bot.start();

process.on('uncaughtException', (error) => {
    // eslint-disable-next-line no-console
    console.error('uncaughtException', error || '');
    
    process.exit(1);
});

process.on('unhandledRejection', (reason, p) => {
    // eslint-disable-next-line no-console
    console.error('unhandledRejection', reason || '', p || '');
    
    process.exit(1);
});
