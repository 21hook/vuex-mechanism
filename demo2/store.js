import {isObject, assert} from './util'

let Vue

/**
 * Define a Store class which dispatches a list of actions defined by the client.
 */
class Store {
    constructor(options = {}) {
        if (!Vue && typeof window !== 'undefined' && window.Vue) {
            install(window.Vue)
        }
        this._actions = Object.create(null); // create an object with null as its prototype object

        const store = this;
        const {dispatch} = this; // object destructuring, assignment

        // expose the interface to dispatch a list of actions
        this.dispatch = function boundDispatch (type, payload) { // fn ref; first-class fn
            return dispatch.call(store, type, payload) // access to dispatch var
        }
    }

    // instance methods
    /**
     * Dispatch the action & payload data, or trigger the action.
     */
    dispatch (_type, _payload) {
        // check object-style dispatch
        const {
            type,
            payload
        } = unifyObjectStyle(_type, _payload)
        const entry = this._actions[type] // get the action of that type

        if (!entry) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(`[vuex] unknown action type: ${type}`)
            }
            return
        } // RI: the action fn must exist

        // trigger the action of that type
        return entry.length > 1
            ? Promise.all(entry.map(handler => handler(payload)))
            : entry[0](payload)
    }
}

/* module private members */
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
