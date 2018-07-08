import devtoolPlugin from './devtool'
import { isObject, assert } from './util'

let Vue // bind on install

/**
 * Define a Store class which stores a list of fns as a subscriber.
 * When the commit method is called, the store object will pass the message type & arg
 * to the fn subscriber in the development tool plugin.
 */
class Store { // define publishers
    constructor() {
        if (typeof window !== 'undefined' && window.Vue) {
            install(window.Vue); // install Vue object
        }

        // private object fields
        this._mutations = Object.create(null); // empty object prototype
        this._subscribers = []; // store the fn subscribers

        const store = this;
        const {commit} = this; // destruct object; assignment

        // private object methods
        // expose the interface to commit the action type & payload data
        this.commit = function boundCommit (type, payload) { // fn ref; first-class data
            return commit.call(store, type, payload) // ref to commit var
        }

        // init the development tool hook, add mutation subscribers for state property
        if (Vue.config.devtools) {
            devtoolPlugin(this)
        }
    }
    // instance methods
    /**
     * Expose the subscribe interface for fn subscribers.
     */
    subscribe(fn) { // add the interfaces of the subscriber
        return genericSubscribe(fn, this._subscribers)
    }
    /**
     * Call mutation on the store object, & commit the message type & args into the development tool
     * by calling its fn subscriber.
     */
    commit(_type, _payload) {
        const {
            type,
            payload,
        } = unifyObjectStyle(_type, _payload) // object destructuring; assignment

        const mutation = { type, payload } // ref type & payload vars
        const entry = this._mutations[type] // get the mutation fn list
        if (!entry) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(`[vuex] unknown mutation type: ${type}`)
            }
            return
        } // RI: the mutation fn list must exist

        // call each mutation on store object
        this._withCommit(() => {
            entry.forEach(function commitIterator (handler) { // function var/ref
                handler(payload)
            })
        })

        // trigger the fn subscribers with message args
        this._subscribers.forEach(sub => sub(mutation, this.state))
    }

    /**
     * Call mutations on the store object.
     */
    _withCommit (fn) { // pass fn ref; first-class fn
        const committing = this._committing
        this._committing = true
        fn()
        this._committing = committing
    }

}

/* private module members */
function unifyObjectStyle (type, payload, options) {
    if (isObject(type) && type.type) {
        options = payload
        payload = type
        type = type.type
    }

    if (process.env.NODE_ENV !== 'production') {
        assert(typeof type === 'string', `expects string as the type, but found ${typeof type}.`)
    }

    return { type, payload, options }
}
/**
 * Push fn as subscribers of a store object.
 */
function genericSubscribe (fn, subs) {
    if (subs.indexOf(fn) < 0) {
        subs.push(fn)
    }
    return () => { // return fn ref; first-class fn
        const i = subs.indexOf(fn)
        if (i > -1) {
            subs.splice(i, 1)
        }
    }
}

export function install (_Vue) {
    if (Vue && _Vue === Vue) {
        if (process.env.NODE_ENV !== 'production') {
            console.error(
                '[vuex] already installed. Vue.use(Vuex) should be called only once.'
            )
        }
        return
    }
    Vue = _Vue
    applyMixin(Vue)
}
