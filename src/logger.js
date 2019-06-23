import path from 'path';
import config from 'config';
import winston from 'winston';
import LogzioWinstonTransport from 'winston-logzio';

import { isProductionEnvironment } from './utils';

const hasLogzIoConfig = config.has('logging.logz_io_token');

const logger = winston.createLogger({
    transports: [
        !isProductionEnvironment() && new winston.transports.Console(),
        !hasLogzIoConfig &&
            isProductionEnvironment() &&
            new winston.transports.File({ filename: path.resolve(__dirname, '../logs/server.log') }),
        hasLogzIoConfig &&
            isProductionEnvironment() &&
            new LogzioWinstonTransport({
                level: config.get('logging.level'),
                token: config.get('logging.logz_io_token'),
                format: winston.format.combine(
                    winston.format(info => ({
                        ...info,

                        nodejs: {
                            labels: {
                                app: 'discord-bot',
                            },
                        },
                    }))(),
                    winston.format.json(),
                ),
            }),
    ].filter(Boolean),
    level: config.get('logging.level'),
});

if (hasLogzIoConfig && isProductionEnvironment()) {
    winston.remove(winston.transports.Console);
}

export default logger;
