import config from 'config';

const nodeEnv = config.util.getEnv('NODE_ENV');

/**
 * Checks to see if the server is running on a development environment.
 */
export const isDevelopmentEnvironment = (): boolean => {
    return nodeEnv === 'development';
};

/**
 * Checks to see if the server is running on a test environment.
 */
export const isTestEnvironment = (): boolean => {
    return nodeEnv === 'test';
};

/**
 * Checks to see if the server is running on a production environment.
 */
export const isProductionEnvironment = (): boolean => {
    return nodeEnv === 'production';
};
