const config = require('./config.json');
const secret = require('./secret.json');

const joinedConfig = Object.assign({}, config, secret);

module.exports = joinedConfig;