class BaseWatcher {
    constructor(bot) {
        this.bot = bot;
    }

    /**
     * If this watcher is enabled or not.
     *
     * @type {boolean}
     */
    enabled = true;
}

export default BaseWatcher;