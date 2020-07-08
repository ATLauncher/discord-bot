import * as path from 'path';
import config from 'config';
import * as winston from 'winston';
import type Transport from 'winston-transport';
import LogzioWinstonTransport from 'winston-logzio';

import { isProductionEnvironment } from './env';

const hasLogzIoConfig = config.has('logging.logzIoToken');
const isProduction = isProductionEnvironment();

const logger = winston.createLogger({
    transports: [
        !isProduction && new winston.transports.Console(),
        !hasLogzIoConfig &&
            isProduction &&
            new winston.transports.File({ filename: path.resolve(__dirname, '../logs/server.log') }),
        hasLogzIoConfig &&
            isProduction &&
            new LogzioWinstonTransport({
                level: config.get<string>('logging.level'),
                token: config.get<string>('logging.logzIoToken'),
                format: winston.format.combine(
                    winston.format((info) => ({
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
    ].filter(Boolean) as Transport[],
    level: config.get<string>('logging.level'),
});

if (hasLogzIoConfig && isProduction) {
    winston.remove(winston.transports.Console);
}

export default logger;
