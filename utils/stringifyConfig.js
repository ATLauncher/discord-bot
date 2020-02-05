const fs = require('fs');
const config = require('config');

const buff = Buffer.from(JSON.stringify(config));
const base64data = buff.toString('base64');

console.log(base64data);
