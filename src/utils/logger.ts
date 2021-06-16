import config from 'config';
import * as winston from 'winston';
import type Transport from 'winston-transport';
import newRelicFormatter from '@newrelic/winston-enricher';
import winstonNewrelicLogsTransport from 'winston-newrelic-logs-transport';

import { isProductionEnvironment } from './env';

const isNewRelicEnabled = config.get<boolean>('new_relic.enabled') ?? false;
const isProduction = isProductionEnvironment();

const logger = winston.createLogger({
    transports: [
        !isProduction && new winston.transports.Console(),
        isNewRelicEnabled &&
            new winstonNewrelicLogsTransport({
                licenseKey: config.get('new_relic.license_key'),
                apiUrl: 'https://log-api.newrelic.com/',
            }),
    ].filter(Boolean) as Transport[],
    format: isNewRelicEnabled ? newRelicFormatter() : undefined,
    level: config.get<string>('logging.level'),
});

export default logger;
