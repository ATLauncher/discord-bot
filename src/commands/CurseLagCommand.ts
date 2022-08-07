import * as Discord from 'discord.js';

import BaseCommand from './BaseCommand';

class CurseLagCommand extends BaseCommand {
    /**
     * The pattern to match against. If the message matches this pattern then we will respond to it with the action
     * method.
     */
    pattern = /^!curselag/;

    /**
     * The description of what the command does.
     */
    description =
        'This will post a message about the lag between CurseForge showing latest Minecraft version mods and the CurseForge adding it to their systems.';

    /**
     * The function that should be called when the event is fired.
     */
    async execute(message: Discord.Message) {
        await message.channel.send(
            `We use CurseForge APIs which do not support new Minecraft versions on their API straight away, so that's why mods are not found. Until the CurseForge team add the new Minecraft version to their system, the API won't return anything for that version.

You can get around it by disabling "Add Mod Restrictions" in the launchers settings, but be aware, if you do this, it will show all mods regardless of which Minecraft version they're for. So if you do this, be careful what you install and grab the correct file for the version of Minecraft you're using.`,
        );

        message.delete();
    }
}

export default CurseLagCommand;
