const config = require('config');

console.log(
    `https://discordapp.com/oauth2/authorize?client_id=${config.get(
        'discord.client_id',
    )}&scope=bot&permissions=1211628550`,
);
