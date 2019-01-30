import path from 'path';
import config from 'config';
import winston from 'winston';
import LogzioWinstonTransport from 'winston-logzio';

import { isDevelopmentEnvironment, isProductionEnvironment } from './utils';

const hasLogzIoConfig = config.has('logging.logz_io_token');

const logger = winston.createLogger({
    transports: [
        isDevelopmentEnvironment() && new winston.transports.Console(),
        !hasLogzIoConfig &&
            isProductionEnvironment() &&
            new winston.transports.File({ filename: path.resolve(__dirname, '../logs/server.log') }),
        hasLogzIoConfig &&
            new LogzioWinstonTransport({
                level: config.get('logging.level'),
                token: config.get('logging.logz_io_token'),
                format: winston.format.combine(
                    winston.format(function (info) {
                        return {
                            ...info,

                            nodejs: {
                                labels: {
                                    app: 'discord-bot',
                                },
                            },
                        };
                    })(),
                    winston.format.json()
                ),
            }),
    ].filter(Boolean),
    level: config.get('logging.level'),
});

export default logger;
