import config from 'config';

const nodeEnv = config.util.getEnv('NODE_ENV');

/**
 * Checks to see if the server is running on a development environment.
 *
 * @export
 * @returns {boolean}
 */
export function isDevelopmentEnvironment() {
    return nodeEnv === 'development';
}

/**
 * Checks to see if the server is running on a test environment.
 *
 * @export
 * @returns {boolean}
 */
export function isTestEnvironment() {
    return nodeEnv === 'test';
}

/**
 * Checks to see if the server is running on a production environment.
 *
 * @export
 * @returns {boolean}
 */
export function isProductionEnvironment() {
    return nodeEnv === 'production';
}
