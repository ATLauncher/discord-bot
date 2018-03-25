# Discord-Bot
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FATLauncher%2Fdiscord-bot.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FATLauncher%2Fdiscord-bot?ref=badge_shield)

This is the code for our Discord bot which runs on our official Discord server at https://atl.pw/discord.

## Development
First things first you must have at least NodeJS 8.4.0. We highly recommend you use
[NVM](https://github.com/creationix/nvm) if on a unix like system as you can simply run
`nvm use` in order to use the correct version of NodeJS.

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

### Including config
In order to use the docker image, configs must be provided at the `/app/config/` directory. Use
this image as a base image and then add in your configs or you can alternatively provide a base64
encoded string of the config in the `DISCORD_BOT_CONFIG` environment variable. You can easily
generate this from your `config/config.json` file by running `npm run config:base64`.

## Database
This bot can use one of two different types of database:

 - AWS DynamoDB (remote)
 - NEDB (local)
 
To use AWS DynamoDB, put the following into your `config.js` file:

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

## Contributing
If you wish to contribute, please see the `CONTRIBUTING.md` file in the root of this repository.

## License
This code is licensed under the MIT license. For more details see the `LICENSE` file in the root
of this repository.


[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FATLauncher%2Fdiscord-bot.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FATLauncher%2Fdiscord-bot?ref=badge_large)