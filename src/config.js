const config = require('../config/config.json');
const secret = require('../config/secret.json');


export default Object.assign({}, config, secret);