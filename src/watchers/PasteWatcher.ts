import got from 'got';
import pluralize from 'pluralize';
import * as Discord from 'discord.js';

import BaseWatcher from './BaseWatcher';

import { COLOURS } from '../constants/discord';
import { hasLogBeenScanned, markLogAsScanned } from '../utils/db';

/**
 * This watcher checks for people saying bad words.
 */
class PasteWatcher extends BaseWatcher {
    /**
     * The methoda this watcher should listen on.
     */
    methods: Array<keyof Discord.ClientEvents> = ['message', 'messageUpdate'];

    /**
     * Run the watcher with the given parameters.
     */
    async action(method: keyof Discord.ClientEvents, ...args: Discord.ClientEvents['message' | 'messageUpdate']) {
        const message = args[1] || args[0];

        if (message.cleanContent) {
            if (message.cleanContent.includes('https://paste.atlauncher.com/view')) {
                const matches = message.cleanContent.match(/(https:\/\/paste.atlauncher.com\/view\/\w{8})/gm);

                if (matches?.length && !(await hasLogBeenScanned(matches[0]))) {
                    const pasteUrl = matches[0].replace('/view/', '/view/raw/');

                    try {
                        const response = await got(pasteUrl);

                        const errors = [];

                        if (
                            response.body.match(/Error trying to download/) ||
                            response.body.match(/Failed to connect to files\.minecraftforge\.net/) ||
                            response.body.match(/Error downloading.*?\. Expected hash of/) ||
                            response.body.match(
                                /javax\.net\.ssl\.SSLException: Unrecognized SSL message, plaintext connection\?/,
                            )
                        ) {
                            errors.push({
                                name: 'Cannot download files',
                                value:
                                    "The launcher is having issues downloading files necessary to install and play modpacks. This is usually due to a firewall or antivirus software blocking the connections on your computer/network.\n\nIf you have a firewall/antivirus, disable it temporarily to see if it's the cause. If that works, see [this page](https://atlauncher.com/help/whitelist) for whitelisting domains in your firewall/antivirus.\n\nIf that's not the case, you may have luck restarting your computer as well as your modem and/or router. In some cases uninstalling Java, restarting your computer, then installing Java fresh can sometimes fix the issue.",
                            });
                        }

                        if (
                            response.body.match(/java\.net\.URLClassLoader are in module java\.base of loader/) ||
                            response.body.match(
                                /java\.base\/jdk\.internal\.loader\.ClassLoaders\$AppClassLoader cannot be cast to java\.base\/java\.net\.URLClassLoader/,
                            )
                        ) {
                            errors.push({
                                name: 'Using newer Java version',
                                value:
                                    "You're using a newer version of Java which is not compatible with modded Minecraft.\n\nInstall Java 8 to fix the issue. You can get Java 8 from [here](https://atl.pw/java8download)\n\nOnce installed, be sure to restart your computer to make sure the newly installed Java version has installed correctly.",
                            });
                        }

                        if (response.body.match(/hashes\.json returned response code 404 with message of Not Found/)) {
                            errors.push({
                                name: 'Using outdated launcher',
                                value:
                                    "You're using an outdated version of the launcher which no longer works.\n\nPlease download the latest version of the launcher from [here](https://atlauncher.com/downloads) and overwrite the old version.",
                            });
                        }

                        if (response.body.match(/ClassNotFoundException: cpw.mods.fml.common.launcher.FMLTweaker/)) {
                            errors.push({
                                name: 'Instance not installed correctly',
                                value:
                                    "The instance you're trying to launch may be corrupted or missing some vital files needed.\n\nReinstall the instance to see if it fixes the issue.",
                            });
                        }

                        if (response.body.match(/Pixel format not accelerated/)) {
                            errors.push({
                                name: 'Graphics issue',
                                value:
                                    'There was an issue between your graphics card/drivers and Minecraft. To find a potential fix, please see [this post](https://discordapp.com/channels/117047818136322057/276161572534091776/596335242575478805).',
                            });
                        }

                        if (response.body.match(/64 Bit Java: false/)) {
                            errors.push({
                                name: 'Using 32 bit Java',
                                value:
                                    "You're using 32 bit Java. This will limit you to 1GB maximum of ram and most modpacks will not play at all.\n\nTo fix this please see [this link](https://atlauncher.com/help/32bit). Note that if that doesn't work for you, you may need to uninstall all Java from your computer, restart it, and then install Java as directed on that link.",
                            });
                        }

                        if (
                            response.body.match(/The specified size exceeds the maximum representable size/) ||
                            response.body.match(/Could not reserve enough space for object heap/)
                        ) {
                            errors.push({
                                name: 'Allocating too much ram',
                                value:
                                    "You're allocating more ram to Minecraft than you have available on your system. Please lower your ram settings in the launcher's settings by following [this page](https://atlauncher.com/help/change-ram).",
                            });
                        }

                        if (
                            response.body.match(/java\.lang\.OutOfMemoryError/) ||
                            response.body.match(/Failed to allocate CM marking stack/) ||
                            response.body.match(
                                /There is insufficient memory for the Java Runtime Environment to continue/,
                            ) ||
                            response.body.match(/Native memory allocation \(mmap\) failed/)
                        ) {
                            errors.push({
                                name: 'Out of memory',
                                value:
                                    "Minecraft has run out of memory. You need to increase the amount of ram used for launching Minecraft. See [this post](https://discordapp.com/channels/117047818136322057/276161572534091776/603918060750897173) for more information on how to do that.\n\nIf changing ram allocation didn't help, then you may need to close some applications on your computer in order to free up available memory for Minecraft to run.",
                            });
                        }

                        if (
                            response.body.match(
                                /at bspkrs\.util\.ModVersionChecker\.<init>\(ModVersionChecker\.java:57\)/,
                            )
                        ) {
                            errors.push({
                                name: 'Update check failure',
                                value:
                                    'Go into the config folder of the instance and open up `bspkrsCore.cfg` in notepad. Change the line `B:allowUpdateCheck=true` to `B:allowUpdateCheck=false` and save the file.',
                            });
                        }

                        // only ask about crash report if no other errors found
                        if (!errors.length) {
                            if (
                                response.body.match(/Game crashed! Crash report saved to/) ||
                                response.body.match(/Minecraft ran into a problem! Report saved to/)
                            ) {
                                errors.push({
                                    name: 'Minecraft crashed',
                                    value:
                                        'Minecraft has crashed and generated a crash report. Please click the "Open Folder" button on the instance and then grab the latest file from the "crash-reports" folder and upload the contents to https://pastebin.com and post the link here (if you haven\'t already.',
                                });
                            }
                        }

                        if (errors.length) {
                            message.reply(
                                new Discord.MessageEmbed({
                                    title: `I've scanned your log, and found ${errors.length} potential ${pluralize(
                                        'error',
                                        errors.length,
                                    )}:`,
                                    description:
                                        "**NOTE**: This is an automated scan and may not be 100% accurate. Please attempt the fixes mentioned below and if they don't help, please close and reopen the launcher, try again and provide us with new logs without clearing the console after restarting it.",
                                    color: COLOURS.RED,
                                    fields: errors,
                                }),
                            );
                        }

                        markLogAsScanned(matches[0]);
                    } catch (e) {
                        // ignored
                    }
                }
            }
        }
    }
}

export default PasteWatcher;
