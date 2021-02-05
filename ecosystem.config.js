module.exports = {
    apps: [
        {
            name: 'discord-bot',
            script: 'dist/index.js',
            cwd: `${__dirname}`,
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
    ],
    deploy: {
        production: {
            user: 'node',
            host: process.env.BOX_IP,
            ref: 'origin/master',
            repo: 'git@github.com:ATLauncher/discord-bot.git',
            path: '/home/node/discord-bot',
            'post-setup': 'ln -s /mnt/discord_bot_data_volume/db/ /home/node/discord-bot/current/db; ln -s /mnt/discord_bot_data_volume/config/production.json /home/node/discord-bot/current/config/production.json',
            'post-deploy':
                'rm -rf dist; npm install; npm run build; pm2 startOrRestart ecosystem.config.js --env production',
        },
    },
};
