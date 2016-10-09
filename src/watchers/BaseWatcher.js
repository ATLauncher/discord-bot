import BaseModule from '../BaseModule';

class BaseWatcher extends BaseModule {
    constructor(bot) {
        super(bot);
    }

    /**
     * If this module should respond to all incoming messages or not.
     *
     * @type {boolean}
     */
    respondToAll = true;
}

export default BaseWatcher;