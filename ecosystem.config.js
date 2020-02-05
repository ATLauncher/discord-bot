module.exports = {
    apps: [
        {
            name: 'discord-bot',
            script: 'dist/index.js',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'development',
                NODE_CONFIG_DIR: __dirname,
            },
            env_production: {
                NODE_ENV: 'production',
                NODE_CONFIG_DIR: __dirname,
            },
        },
    ],
    deploy: {
        production: {
            user: 'node',
            host: process.env.BOX_IP,
            ref: 'origin/ts-and-deploy-uplift',
            repo: 'git@github.com:ATLauncher/discord-bot.git',
            path: '/home/node/discord-bot',
            'post-deploy':
                'npm install; npm run build; ln -s ../shared/production.json config/production.json; pm2 startOrRestart ecosystem.config.js --env production',
        },
    },
};
