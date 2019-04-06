import fs from 'fs';

/**
 * The watcher bus loads all the watchers and sets up the listeners and any configuration.
 *
 * @class WatcherBus
 */
class WatcherBus {
    /**
     * Creates an instance of WatcherBus.
     *
     * @param {Client} bot
     * @memberof WatcherBus
     */
    constructor(bot) {
        this.bot = bot;
        this.watchers = {};
        this.watcherFiles = fs.readdirSync(`${__dirname}/watchers`).filter((file) => file !== 'BaseWatcher.js');

        this.loadWatchers();
        this.setupWatcherListeners();
    }

    /**
     * This will load all the watchers in the watchers directory.
     *
     * @memberof WatcherBus
     */
    loadWatchers() {
        let loadedWatchers = [];

        // instantiate all the commands
        loadedWatchers = this.watcherFiles.map((watcherFile) => {
            const watcherClass = require(`${__dirname}/watchers/${watcherFile}`);

            return new watcherClass.default(this.bot);
        });

        // remove any non active commands
        loadedWatchers = loadedWatchers.filter((watcher) => watcher.enabled);

        // sort by priority
        loadedWatchers.sort((a, b) => {
            if (a.priority < b.priority) {
                return -1;
            }

            if (a.priority > b.priority) {
                return 1;
            }

            return 0;
        });

        // group the commands by method
        loadedWatchers.forEach((watcher) => {
            let watcherMethods = [watcher.method];

            if (Array.isArray(watcher.method)) {
                watcherMethods = watcher.method;
            }

            watcherMethods.forEach((watcherMethod) => {
                if (!this.watchers.hasOwnProperty(watcherMethod)) {
                    this.watchers[watcherMethod] = [];
                }

                this.watchers[watcherMethod].push(watcher);
            });
        });
    }

    /**
     * This will setup all the watcher listeners and register them with the bot.
     *
     * @memberof WatcherBus
     */
    setupWatcherListeners() {
        Object.keys(this.watchers).forEach((method) => {
            this.bot.on(method, (...args) => {
                this.watchers[method].forEach(async (watcher) => {
                    if (await watcher.shouldRun(method, ...args)) {
                        watcher.action(method, ...args);
                    }
                });
            });
        });
    }
}

export default WatcherBus;
