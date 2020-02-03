# Discord-Bot

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FATLauncher%2Fdiscord-bot.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FATLauncher%2Fdiscord-bot?ref=badge_shield)
[![Discord](https://discordapp.com/api/guilds/117047818136322057/embed.png?style=shield)](https://atl.pw/discordfromgithub)

This is the code for our Discord bot which runs on our official Discord server at https://atl.pw/discord.

## Development

To get setup you will need to make sure you have the following installed on your machine:

-   [NodeJS 10](https://nodejs.org/en/download/)
    -   check out [nvm](https://github.com/creationix/nvm) or [nvm-windows](https://github.com/coreybutler/nvm-windows)

We'll assume you're a capable developer, so we won't tell you how to go about installing those on your machine :)

Next clone this repo to a directory and then run `npm install` to install all the dependencies
needed to run the bot.

Lastly copy the `config/config.json.example` file to `config/config.json` and fill out as
required.

Once installed you can run `npm run dev` to start the bot and auto reload when any changes are made
to files.

## Building

To build this bot ready for running in production simply run `npm run build` which will compile all
the files in the `src/` directory and run it through Babel and spit it out in the `dist/` directory.

Once built simply run `npm run start` which will run the `index.js` file in the `dist/` folder.

## Docker

This repository contains support for Docker. Simply run `docker build` to build a Docker image ready
to use.

Alternatively we have an automated build running on our Docker Hub repo at
https://hub.docker.com/r/atlauncher/discord-bot/ accessed with identifier `atlauncher/discord-bot`.

## Deployment

This repository is automatically set to deploy a Digital Ocean droplet, set it up and then deploy
the built code to the droplet and keep running using nodemon.

This is achieved using the following:

- [Terraform](https://www.terraform.io) to create and maintain the droplets in Digital Ocean
- [PM2](https://pm2.keymetrics.io/) to keep the application up and running

These steps are not expected to be run manually, and are setup as part of the CI/CD pipeline.

But if you do wish to run it locally, or in another CI/CD pipeline, the instructions are below.

### Manual Deployment Setup

First install Terraform on your machine. Once done, setup some environment variables as follows:

- `TF_VAR_do_token`: your DigitalOcean token
- `TF_VAR_ssh_fingerprint`: a SSH key fingerprint from your DigitalOcean account

If you don't set these environment variables, you'll have to enter them everytime you make your
Terraform plan.

**NOTE**: We use [Terraform Cloud](https://app.terraform.io/) to manage state and locking. If you
do not wish to use that, you'll need to remove the `backend.tf` file before running the below
commands.

Now you can deploy the droplet with:

```sh
cd build/terraform
terraform init
terraform plan -out tf.plan
terraform apply tf.plan
```

## Config

Configuration is handled through a NPM package called `config`. You can see all the ways to change
the configuration at <https://github.com/lorenwest/node-config>.

Do not change the `default.json` file at all. When new configs are added with defaults, if you have
a conflict here, it may negate some changes and cause issues.

The best thing to do is to create a `local.json` file in the config folder and put your config in
there. That file is gitignored by default, so shouldn't get committed up.

Alternatively you can provide a `NODE_CONFIG` environment variable with a json string. The easiest
way to get this, is to create a `local.json` file in the config folder, and then run:

```sh
node utils/stringifyConfig.js
```

This will print out a json string of the generated config

## Database

This bot can use one of two different types of database:

-   AWS DynamoDB (remote)
-   NEDB (local)

To use AWS DynamoDB, put the following into your config:

```
    "db": {
        "messages": {
            "params": {
                "TableName": ""
            },
            "region": "us-west-2",
            "accessKeyId": "",
            "secretAccessKey": ""
        },
        "settings": {
            "params": {
                "TableName": ""
            },
            "region": "us-west-2",
            "accessKeyId": "",
            "secretAccessKey": ""
        },
        "users": {
            "params": {
                "TableName": ""
            },
            "region": "us-west-2",
            "accessKeyId": "",
            "secretAccessKey": ""
        }
    },
```

To use the local NEDB you don't need to do anything. Just keep the db section in the config empty.
It will store all the data locally in the `db/` directory.

## Logging

By default, all logging will be done to the console during development, and to a log file in the
`logs` directory in production.

By default the logging level is set to `error` level, but can be set to:

-   error
-   info
-   debug

### Logz.io Logging

To log to a Logz.io account, simply add a config value in `logging.logz_io_token` with a string
containing your api token.

## Sentry error reporting

If you wish to enable sentry error reporting, simply add your DSN as config value `sentry.dsn`.

## Contributing

If you wish to contribute, please see the `CONTRIBUTING.md` file in the root of this repository.

## License

This code is licensed under the MIT license. For more details see the `LICENSE` file in the root
of this repository.

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FATLauncher%2Fdiscord-bot.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FATLauncher%2Fdiscord-bot?ref=badge_large)
