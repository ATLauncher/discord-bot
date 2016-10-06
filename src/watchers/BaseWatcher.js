class BaseWatcher {
    constructor(bot) {
        this.bot = bot;
    }

    /**
     * The priority of this watcher. The lower the number the first it will be to run.
     *
     * @type {number}
     */
    priority = 0;

    /**
     * If this watcher is enabled or not.
     *
     * @type {boolean}
     */
    enabled = true;
}

export default BaseWatcher;