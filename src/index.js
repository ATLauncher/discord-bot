import Bot from './Bot';
import logger from './logger';

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
