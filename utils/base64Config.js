import config from '../src/config';

console.log(Buffer.from(JSON.stringify(config)).toString('base64'));