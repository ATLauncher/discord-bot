import * as fs from 'fs';
import * as Discord from 'discord.js';

import BaseWatcher from './watchers/BaseWatcher';
import logger from './utils/logger';
import Bot from './Bot';

/**
 * The watcher bus loads all the watchers and sets up the listeners and any configuration.
 */
class WatcherBus {
    /**
     * The instance of the Bot.
     */
    bot: Bot;

    /**
     * List of watchers and the client events they respond to.
     */
    watchers: { [action in keyof Discord.ClientEvents]?: BaseWatcher[] };

    /**
     * List of watcher filenames.
     */
    watcherFiles: string[];

    /**
     * Creates an instance of WatcherBus.
     */
    constructor(bot: Bot) {
        this.bot = bot;
        this.watchers = {};
        this.watcherFiles = fs.readdirSync(`${__dirname}/watchers`).filter((file) => !file.startsWith('BaseWatcher.'));

        this.loadWatchers();
        this.setupWatcherListeners();
    }

    /**
     * This will load all the watchers in the watchers directory.
     */
    loadWatchers() {
        let loadedWatchers: BaseWatcher[] = [];

        // instantiate all the watchers
        loadedWatchers = this.watcherFiles.map((watcherFile) => {
            const WatcherClass = require(`${__dirname}/watchers/${watcherFile}`).default;

            return new WatcherClass(this.bot);
        });

        // remove any non active watchers
        loadedWatchers = loadedWatchers.filter((watcher) => watcher.enabled);

        // sort watchers by priority
        loadedWatchers = loadedWatchers.sort((a, b) => {
            if (a.priority < b.priority) {
                return -1;
            }

            if (a.priority > b.priority) {
                return 1;
            }

            return 0;
        });

        // group the watchers by method
        loadedWatchers.forEach((watcher) => {
            logger.debug(`Loading watcher ${watcher.constructor.name}`);
            watcher.methods.forEach((method) => {
                if (!this.watchers[method]) {
                    this.watchers[method] = [watcher];
                }

                this.watchers[method]?.push(watcher);
            });
        });
    }

    /**
     * This will setup all the watcher listeners and register them with the bot.
     */
    setupWatcherListeners() {
        Object.keys(this.watchers).forEach((method) => {
            this.bot.client.on(method as keyof Discord.ClientEvents, (...args) => {
                // @ts-ignore different ClientEvents have different args layout, so this type isn't safe
                this.watchers[method as keyof Discord.ClientEvents].forEach(async (watcher) => {
                    // @ts-ignore
                    if (await watcher.shouldRun(method, ...args)) {
                        // @ts-ignore
                        watcher.action(method, ...args);
                    }
                });
            });
        });
    }
}

export default WatcherBus;
