let Vue

/**
 * Define a Store class which adds the getters of each module as computed properties of the Vue components.
 */
class Store {
    constructor(options = {}) {
        if (!Vue && typeof window !== 'undefined' && window.Vue) {
            install(window.Vue)
        }

        const {
            plugins = [], // default value
        } = options; // object destructing, assignment
        const state = this._modules.root.state


        // initialize the store vm, which is responsible for the reactivity
        // (also registers _wrappedGetters as computed properties)
        resetStoreVM(this, state)

        plugins.forEach(plugin => plugin(this)) // install plugins
    }
}

/* module private members */
/**
 * Add getter methods of each module of the store object as computed properties of the Vue components,
 * & when mutating the state property of the module, the updated state will output & render into component
 * tree, automatically.
 */
function resetStoreVM (store, state) {

    // bind store public getters
    store.getters = {}
    const wrappedGetters = store._wrappedGetters
    const computed = {}

    // bind the get event to each getter method
    Object.keys(wrappedGetters).forEach((fn, key) => {
        // use computed to leverage its lazy-caching mechanism
        computed[key] = () => fn(store)
        Object.defineProperty(store.getters, key, {
            get: () => store._vm[key],
            enumerable: true // for local getters
        })
    })


    // store vue instance as a property of a store object
    // add each getter as computed property of _vm property of a store object
    store._vm = new Vue({
        data: {
            $$state: state
        },
        computed
    })
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
