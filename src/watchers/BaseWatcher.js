import BaseModule from '../BaseModule';

/**
 * This is the base watcher class which all watchers are defined from.
 *
 * @class BaseWatcher
 * @extends {BaseModule}
 */
class BaseWatcher extends BaseModule {
    /**
     * If this module should respond to all incoming messages or not.
     *
     * @type {boolean}
     * @memberof BaseWatcher
     */
    respondToAll = true;
}

export default BaseWatcher;
