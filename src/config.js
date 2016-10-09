const fs = require('fs');
const path = require('path');

const config = getConfig();

const environmentConfig = getEnvironmentConfig();

export default Object.assign({}, config, environmentConfig);

function getEnvironmentConfig() {
    if (process.env.DISCORD_BOT_CONFIG) {
        const buffer = Buffer.from(process.env.DISCORD_BOT_CONFIG, 'base64');
        const json = JSON.parse(buffer);

        return json;
    }

    return {};
}

function getConfig() {
    try {
        const configPath = path.resolve(__dirname, '../config/config.json');

        fs.accessSync(configPath);

        return require(configPath)
    } catch(e) {
        return {};
    }
}