import * as Discord from 'discord.js';

import BaseCommand from './BaseCommand';

class MicrosoftAccountCommand extends BaseCommand {
    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     */
    pattern = /^!microsoftaccount/;

    /**
     * The description of what the command does.
     */
    description = 'This will post a message about the Microsoft account migration.';

    /**
     * The function that should be called when the event is fired.
     */
    async execute(message: Discord.Message) {
        await message.channel.send(
            `Mojang have announced that Java edition will require linking a Microsoft account (https://www.minecraft.net/en-us/article/java-edition-moving-house) in order to use in the future.

As of the 1st of December, all new purchases of Minecraft Java Edition will require the use of a Microsoft account. Migration of old accounts will happen in 2021.

**New purchases and migrated accounts will be unable to use ATLauncher** and some other third party tools for Minecraft that require authentication with the new Microsoft accounts.

Mojang have stated that they will add support for third party tools, but they have yet to provide any way for third party tools to use Microsoft accounts and currently they have not communicated any news about when it will be coming. We're fully at Microsoft's mercy unfortunately.`,
        );

        message.delete();
    }
}

export default MicrosoftAccountCommand;
