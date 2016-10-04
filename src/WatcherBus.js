import fs from 'fs';

/**
 * The watcher bus loads all the watchers and sets up the listeners and any configuration.
 */
class WatcherBus {
    constructor(bot) {
        this.bot = bot;
        this.watchers = {};
        this.watcherFiles = fs.readdirSync(`${__dirname}/watchers`).filter((file) => (file !== 'BaseWatcher.js'));

        this.loadWatchers();
        this.setupWatcherListeners();
    }

    /**
     * This will load all the watchers in the watchers directory.
     */
    loadWatchers() {
        let loadedWatchers = [];

        // instantiate all the commands
        loadedWatchers = this.watcherFiles.map((watcherFile) => {
            const watcherClass = require(`${__dirname}/watchers/${watcherFile}`);

            return new watcherClass.default(this.bot);
        });

        // remove any non active commands
        loadedWatchers = loadedWatchers.filter((watcher) => ( watcher.enabled ));

        // group the commands by method
        loadedWatchers.forEach((watcher) => {
            if (!this.watchers.hasOwnProperty(watcher.method)) {
                this.watchers[watcher.method] = [];
            }

            this.watchers[watcher.method].push(watcher);
        });
    }

    /**
     * This will setup all the watcher listeners and register them with the bot.
     */
    setupWatcherListeners() {
        Object.keys(this.watchers).forEach((method) => {
            this.bot.on(method, (message) => {
                this.watchers[method].forEach((watcher) => {
                    return watcher.action(message);
                });
            });
        });
    }
}

export default WatcherBus;