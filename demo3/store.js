import ModuleCollection from './module/module-collection'

let Vue

/**
 * Define a Store class which creates a module tree to represent nested state modules.
 */
class Store {
    constructor(options = {}) {
        if (!Vue && typeof window !== 'undefined' && window.Vue) {
            install(window.Vue)
        }

        const {
            plugins = [], // default value, computed property name
        } = options; // object destructing, assignment

        this._actions = Object.create(null)  // create an object with null as its object prototype
        this._mutations = Object.create(null)
        this._wrappedGetters = Object.create(null)

        this._modules = new ModuleCollection(options)
        this._modulesNamespaceMap = Object.create(null)


        const state = this._modules.root.state

        // init root module.
        // this also recursively registers all sub-modules
        // and collects all module getters inside this._wrappedGetters
        installModule(this, state, [], this._modules.root)

        plugins.forEach(plugin => plugin(this)) // install plugins
    }
}

/* module private members */
/**
 * Install each module action/mutation/getter/state in the module tree to the store object, recursively.
 */
function installModule (store, rootState, path, module) {
    const namespace = store._modules.getNamespace(path)

    // base case
    // register in namespace map
    if (module.namespaced) {
        store._modulesNamespaceMap[namespace] = module
    }

    const local = module.context = makeLocalContext(store, namespace, path)

    module.forEachMutation((mutation, key) => {
        const namespacedType = namespace + key
        registerMutation(store, namespacedType, mutation, local)
    })

    module.forEachAction((action, key) => {
        const type = action.root ? key : namespace + key
        const handler = action.handler || action
        registerAction(store, type, handler, local)
    })

    module.forEachGetter((getter, key) => {
        const namespacedType = namespace + key
        registerGetter(store, namespacedType, getter, local)
    })

    // traverse the module tree(divide part)
    module.forEachChild((child, key) => {
        installModule(store, rootState, path.concat(key), child) // recursive case(conquer part)
    })
}

/**
 *  Add each mutation to the store object
 */
function registerMutation (store, type, handler, local) {
    const entry = store._mutations[type] || (store._mutations[type] = [])
    entry.push(function wrappedMutationHandler (payload) {
        handler.call(store, local.state, payload)
    })
}

function registerAction (store, type, handler, local) {
    const entry = store._actions[type] || (store._actions[type] = [])
    entry.push(function wrappedActionHandler (payload, cb) {
        let res = handler.call(store, {
            dispatch: local.dispatch,
            commit: local.commit,
            getters: local.getters,
            state: local.state,
            rootGetters: store.getters,
            rootState: store.state
        }, payload, cb)
        if (!isPromise(res)) {
            res = Promise.resolve(res)
        }
        if (store._devtoolHook) {
            return res.catch(err => {
                store._devtoolHook.emit('vuex:error', err)
                throw err
            })
        } else {
            return res
        }
    })
}

function registerGetter (store, type, rawGetter, local) {
    if (store._wrappedGetters[type]) {
        if (process.env.NODE_ENV !== 'production') {
            console.error(`[vuex] duplicate getter key: ${type}`)
        }
        return
    }
    store._wrappedGetters[type] = function wrappedGetter (store) {
        return rawGetter(
            local.state, // local state
            local.getters, // local getters
            store.state, // root state
            store.getters // root getters
        )
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
