import * as Discord from 'discord.js';

import BaseCommand from './BaseCommand';
import { COLOURS } from '../constants/discord';

interface Topic {
    command: string;
    title: string;
    description: string;
    image?: Discord.EmbedImageData;
}

class HowCommand extends BaseCommand {
    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     */
    pattern = /^!how (\w+)/;

    /**
     * The description of what the command does.
     */
    description =
        'This will post a message with how to do something. You can mention the user for the bot to tag them in the message. Currently only works with `!how portforward`, `!how skins`, `!how debugbat`, `!how java8server` and `!how java17server`.';

    topics: Topic[] = [
        {
            command: 'portforward',
            title: 'How to port forward',
            description:
                "Port forwarding is the process of forwarding ports coming in to your IP address and routing them through your router to a specific computer on your network.\n\nThis is necessary in order to run Minecraft server's from your own home network.\n\nThe process for doing this will vary depending on your router:\n\n1. Find the brand and model of your router.\n2. Visit [https://portforward.com/router.htm](https://portforward.com/router.htm) and find your routers brand (Note this site shows ads which say you need to pay, **you do NOT need to pay anything**, you can close the ads.\n3. Find the model number of your modem on the brands page. Sometimes it may not specifically list your modem, find one that's similar if yours isn't listed.\n4. Follow the instructions listed on that page for Minecraft which uses port **25565** on both **UDP** and **TCP**.\n5. Others should now be able to connect with your external IP which can be found on [https://myexternalip.com/](https://myexternalip.com/).\n6. You can connect to the server using the ip `127.0.0.1` if running on the same computer.\n\nIf you are struggling to do this or it's not working, speak with your ISP's support/helpdesk. Sometimes they may be blocking it from working.\n\nAlso make sure that you do **NOT** put any IP address in the `server.properties` file for the server. Putting any ip in there will cause your server to no longer work 99.9% of the time, so remove any IP address if you've put it in there.",
        },
        {
            command: 'debugbat',
            title: 'Debugging ATLauncher not starting',
            description:
                'Download [this file](https://cdn.atlcdn.net/Debug.bat) to the same folder that ATLauncher is in, then double click it to run it and leave it for a minute and it should then create and open a Debug.txt file in the same folder. Copy paste that into https://paste.ee/ and then share the link.',
        },
        {
            command: 'skins',
            title: 'Minecraft skins not showing on older Minecraft versions',
            description:
                'Mojang removed the servers hosting the skin images for 1.7 and earlier. You need to download [Skin Fixer](https://www.curseforge.com/minecraft/mc-mods/skin-fixer) and add it to your clients (not the server) which will fix it.',
        },
        {
            command: 'java8server',
            title: 'Java 8 is needed for older Minecraft servers',
            description:
                "You need Java 8 to run modded Minecraft servers usually that are older than Minecraft 1.17.\n\nEasiest solution is to uninstall the newer Java from your machine, then install Java 8 from [this link](https://atl.pw/java8download) (if on Windows, make sure to download the 'Windows Offline (64-bit)' version).\n\nIf you want to keep the newer Java on your computer, you can alternatively edit the `LaunchServer.bat` file for the server as per the below image to point to the path you've installed Java 8 (usually somewhere in `C:\\Program Files\\`).",
            image: {
                url: 'https://cdn.atlcdn.net/ChangeServerJavaPath.png',
            },
        },
        {
            command: 'java17server',
            title: 'Java 17 is needed for Minecraft server 1.17 and later',
            description:
                "You need Java 17 to run modded Minecraft servers for Minecraft 1.17 and later.\n\nEasiest solution is to uninstall the other versions of Java from your machine, then install Java 17 from [this link](https://adoptium.net/).\n\nIf you want to keep the other Java versions on your computer, you can alternatively edit the `LaunchServer.bat` file for the server as per the below image to point to the path you've installed Java 17 (usually somewhere in `C:\\Program Files\\`).",
            image: {
                url: 'https://cdn.atlcdn.net/ChangeServerJavaPath.png',
            },
        },
    ];

    /**
     * The function that should be called when the event is fired.
     */
    async execute(message: Discord.Message) {
        const topic = message.cleanContent.match(this.pattern)?.[1];
        const replyWith = this.topics.find((t) => t.command === topic);

        if (replyWith) {
            const user = message.mentions.users.first();
            const embed = new Discord.EmbedBuilder({
                ...replyWith,
                color: COLOURS.PRIMARY,
            });

            if (user) {
                await message.channel.send({ content: `${user}:`, embeds: [embed] });
            } else {
                await message.channel.send({ embeds: [embed] });
            }
        }

        message.delete();
    }
}

export default HowCommand;
