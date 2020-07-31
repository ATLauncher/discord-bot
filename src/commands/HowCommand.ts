import * as Discord from 'discord.js';

import BaseCommand from './BaseCommand';
import { COLOURS } from '../constants/discord';

interface Topic {
    command: string;
    title: string;
    description: string;
}

class HowCommand extends BaseCommand {
    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     */
    pattern = /^!how (\w+)/;

    topics: Topic[] = [
        {
            command: 'portforward',
            title: 'How to port forward',
            description:
                "Port forwarding is the process of forwarding ports coming in to your IP address and routing them through your router to a specific computer on your network.\n\nThis is necessary in order to run Minecraft server's from your own home network.\n\nThe process for doing this will vary depending on your router:\n\n1. Find the brand and model of your router.\n2. Visit [https://portforward.com/router.htm](https://portforward.com/router.htm) and find your routers brand (Note this site shows ads which say you need to pay, **you do NOT need to pay anything**, you can close the ads.\n3. Find the model number of your modem on the brands page. Sometimes it may not specifically list your modem, find one that's similar if yours isn't listed.\n4. Follow the instructions listed on that page for Minecraft which uses port **25565** on both **UDP** and **TCP**.\n5. Others should now be able to connect with your external IP which can be found on [https://myexternalip.com/](https://myexternalip.com/).\n\nIf you are struggling to do this or it's not working, speak with your ISP's support/helpdesk. Sometimes they may be blocking it from working.",
        },
    ];

    /**
     * The function that should be called when the event is fired.
     */
    async execute(message: Discord.Message) {
        const topic = message.cleanContent.match(this.pattern)?.[1];
        const replyWith = this.topics.find((t) => t.command === topic);

        if (replyWith) {
            message.reply(
                new Discord.MessageEmbed({
                    ...replyWith,
                    color: COLOURS.PRIMARY,
                }),
            );
        }

        message.delete();
    }
}

export default HowCommand;
