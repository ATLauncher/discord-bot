const config = require('config');

console.log(
    `https://discordapp.com/oauth2/authorize?clientId=${config.get(
        'discord.clientId',
    )}&scope=bot&permissions=1211628550`,
);
