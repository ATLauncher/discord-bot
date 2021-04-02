# Discord-Bot

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FATLauncher%2Fdiscord-bot.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FATLauncher%2Fdiscord-bot?ref=badge_shield)
[![Discord](https://discordapp.com/api/guilds/117047818136322057/embed.png?style=shield)](https://atl.pw/discordfromgithub)
![Test and Build](https://github.com/ATLauncher/discord-bot/workflows/Test%20and%20Build/badge.svg?branch=master)

This is the code for our Discord bot which runs on our official Discord server at <https://atl.pw/discord>.

## Development

To get setup you will need to make sure you have the following installed on your machine:

-   [NodeJS 14](https://nodejs.org/en/download/)
    -   check out [nvm](https://github.com/creationix/nvm) or [nvm-windows](https://github.com/coreybutler/nvm-windows)

We'll assume you're a capable developer, so we won't tell you how to go about installing those on your machine :)

Next clone this repo to a directory and then run `npm install` to install all the dependencies needed to run the bot.

Lastly copy the `config/config.json.example` file to `config/config.json` and fill out as required.

Once installed you can run `npm run dev` to start the bot and auto reload when any changes are made to files.

## Building

To build this bot ready for running in production simply run `npm run build` which will compile all the files in the
`src/` directory with TypeScript and then spit it out in the `dist/` directory.

Once built simply run `npm run start` which will run the `index.js` file in the `dist/` folder.

## Docker

This repository contains support for Docker. Simply run `docker build -t atlauncher/discord-bot` to build a Docker image
ready to use.

Alternatively we have an automated build running on our Docker Hub repo at
<https://hub.docker.com/r/atlauncher/discord-bot/> accessed with identifier `atlauncher/discord-bot`.

## Deployment

This repository is automatically set to deploy to [railway](https://railway.app/).

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new?template=https%3A%2F%2Fgithub.com%2FATLauncher%2Fdiscord-bot&plugins=postgresql&envs=NODE_CONFIG%2CPORT&NODE_CONFIGDesc=Configuration+for+the+bot&PORTDesc=Port+the+web+server+listens+on&NODE_CONFIGDefault=%7B%7D)

## Config

Configuration is handled through a NPM package called `config`. You can see all the ways to change the configuration at
<https://github.com/lorenwest/node-config>.

Do not change the `default.json` file at all. When new configs are added with defaults, if you have a conflict here, it
may negate some changes and cause issues.

The best thing to do is to create a `local.json` file in the config folder and put your config in there. That file is
gitignored by default, so shouldn't get committed up.

Alternatively you can provide a `NODE_CONFIG` environment variable with a json string. The easiest way to get this, is
to create a `local.json` file in the config folder, and then run:

```sh
node utils/stringifyConfig.js
```

This will print out a json string of the generated config

## Database

This bot uses [Prisma](https://www.prisma.io/) to provide a database connection for storing things.

Prisma supports various different databases, with PostgreSQL being the default out of the box.

This can be configured using the `.env.local` file. If you don't have that file, just copy `.env` to `.env.local`. No
changes should be made to the `.env` file as it is checked into git.

## Logging

By default, all logging will be done to the console during development, and to a log file in the `logs` directory in
production.

By default the logging level is set to `error` level, but can be set to:

-   error
-   info
-   debug

### Logz.io Logging

To log to a Logz.io account, simply add a config value in `logging.logzIoToken` with a string containing your api
token.

## Sentry error reporting

If you wish to enable sentry error reporting, simply add your DSN as config value `sentry.dsn`.

## Caveats

This bot was made specifically for the [ATLauncher Discord server](https://atl.pw/discord) and as such if it's used for
any other purpose outside of that Discord server, there are some caveats to note:

-   Some things are hard coded to expect the layout and setup of the server in the same way as the ATLauncher one
    -   This includes the notion of having a `rules` channel, a `moderation-logs` channel as well as the concept of support
        and non support channels
-   The `JoinWatcher` is again very specific to ATLauncher's needs
-   The bot was made to be run only on one server, so if it's connected to multiple servers, it may not act correctly

## Contributing

If you wish to contribute, please see the `CONTRIBUTING.md` file in the root of this repository.

## License

This code is licensed under the MIT license. For more details see the `LICENSE` file in the root of this repository.

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FATLauncher%2Fdiscord-bot.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FATLauncher%2Fdiscord-bot?ref=badge_large)
