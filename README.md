# Discord-Bot

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FATLauncher%2Fdiscord-bot.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FATLauncher%2Fdiscord-bot?ref=badge_shield)
[![Discord](https://discordapp.com/api/guilds/117047818136322057/embed.png?style=shield)](https://atl.pw/discordfromgithub)
![Test and Build](https://github.com/ATLauncher/discord-bot/workflows/Test%20and%20Build/badge.svg?branch=master)
![Deploy](https://github.com/ATLauncher/discord-bot/workflows/Deploy/badge.svg?branch=master)

This is the code for our Discord bot which runs on our official Discord server at <https://atl.pw/discord>.

## Development

To get setup you will need to make sure you have the following installed on your machine:

- [NodeJS 14](https://nodejs.org/en/download/)
  - check out [nvm](https://github.com/creationix/nvm) or [nvm-windows](https://github.com/coreybutler/nvm-windows)

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

This repository is automatically set to deploy a Digital Ocean droplet, set it up and then deploy the built code to the
droplet.

This is achieved using the following:

- [Terraform](https://www.terraform.io) to create and maintain the droplets in Digital Ocean
- [PM2](https://pm2.keymetrics.io/) to keep the application up and running

These steps are not expected to be run manually, and are setup as part of the CI/CD pipeline.

But if you do wish to run it locally, or in another CI/CD pipeline, the instructions are below.

### Manual Deployment Setup

First install Terraform on your machine. Once done, setup some environment variables as follows:

- `TF_VAR_do_token`: your DigitalOcean token
- `TF_VAR_do_data_volume_id`: the id of the volume on DigitalOcean named as "discord-bot-data-volume"
- `TF_VAR_do_floating_ip`: the floating ip on DigitalOcean to assign to the droplet
- `TF_VAR_ssh_fingerprint`: a SSH key fingerprint from your DigitalOcean account
- `TF_VAR_ssh_private_key`: private key contents matching the above fingerprint

If you don't set these environment variables, you'll have to enter them everytime you make your
Terraform plan.

**NOTE**: We use [Terraform Cloud](https://app.terraform.io/) to manage state and locking. If you do not wish to use
that, you'll need to remove the `backend.tf` file before running the below commands.

Now you can deploy the droplet with:

```sh
cd build/terraform
terraform init
terraform plan -out tf.plan
terraform apply tf.plan
```

Now you can run `pm2 deploy production setup` to setup the droplet ready for deployments.

Once done, you'll also need to copy over a `production.json` file with your config in it to
`/home/node/discord-bot/source/config/production.json`. You can do this easily with the following command:

`scp path/to/production.json node@${BOX_IP}:/home/node/discord-bot/source/config/production.json`

And then to deploy new changes to the code, run `pm2 deploy production`. Note that you will need to change the
`ecosystem.config.js` file in order to point to the correct repository, if it's not this one.

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

This bot uses NEDB to provide a local json filesystem database. It will store all the data locally in the `db/`
directory.

## Logging

By default, all logging will be done to the console during development, and to a log file in the `logs` directory in
production.

By default the logging level is set to `error` level, but can be set to:

- error
- info
- debug

### Logz.io Logging

To log to a Logz.io account, simply add a config value in `logging.logzIoToken` with a string containing your api
token.

## Sentry error reporting

If you wish to enable sentry error reporting, simply add your DSN as config value `sentry.dsn`.

## Caveats

This bot was made specifically for the [ATLauncher Discord server](https://atl.pw/discord) and as such if it's used for
any other purpose outside of that Discord server, there are some caveats to note:

- Some things are hard coded to expect the layout and setup of the server in the same way as the ATLauncher one
  - This includes the notion of having a `rules` channel, a `moderation-logs` channel as well as the concept of support
    and non support channels
- The `JoinWatcher` is again very specific to ATLauncher's needs
- The bot was made to be run only on one server, so if it's connected to multiple servers, it may not act correctly

## Contributing

If you wish to contribute, please see the `CONTRIBUTING.md` file in the root of this repository.

## License

This code is licensed under the MIT license. For more details see the `LICENSE` file in the root of this repository.

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FATLauncher%2Fdiscord-bot.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FATLauncher%2Fdiscord-bot?ref=badge_large)
