// Base data struct for store's module, package with some attribute and method
/**
 * This class create a module data type, which is a base case for the module collection.
 * A module is an object like this:
 *  module
 *    runtime # runtime flag
 *    state # module state
 *    _children # children modules
 *    _rawModule # raw module
 * We can define a module datatype as a base case for the module collection datatype:
 * base case: Module // base element for a module collection
 */
export default class Module {
    constructor (rawModule, runtime) {
        this.runtime = runtime
        // Store some children item
        this._children = Object.create(null)
        // Store the origin module object which passed by programmer
        this._rawModule = rawModule
        const rawState = rawModule.state

        // Store the origin module's state
        this.state = (typeof rawState === 'function' ? rawState() : rawState) || {}
    }

    get namespaced () {
        return !!this._rawModule.namespaced
    }

    getChild (key) {
        return this._children[key]
    }

    addChild (key, module) {
        this._children[key] = module
    }

    removeChild (key) {
        delete this._children[key]
    }

    forEachChild (fn) {
        Object.keys(this._children).forEach((val, i) => fn(val, i))
    }

    forEachGetter (fn) {
        if (this._rawModule.getters) {
            Object.keys(this._rawModule.getters).forEach((val, i) => fn(val, i))
        }
    }

    forEachAction (fn) {
        if (this._rawModule.actions) {
            Object.keys(this._rawModule.actions).forEach((val, i) => fn(val, i))
        }
    }

    forEachMutation (fn) {
        if (this._rawModule.mutations) {
            Object.keys(this._rawModule).forEach((val, i) => fn(val, i))
        }
    }
}
