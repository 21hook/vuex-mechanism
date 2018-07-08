import Module from './module'
import { assert } from '../util'

/**
 * This class creates a module collection class, which is a recursive data type using
 * the module datatype:
 * A module collection is a datatype like this:
 *  module collection
 *    runtime
 *    state
 *    _children
 *      runtime
 *      state
 *      _children
 *        ...
 *      _rawModule
 *    _rawModule
 * The recursive datatype of the module collection is:
 * ModuleCollection<Object>
 *  base case: Module<Object> // base elements
 *  constructor case: Children(Module) // add the newly construct module object as the children of the root module
 *
 * => ModuleCollection<Object> = Module<Object> + children(Module)
 *
 * Then, declare each datatype in the recursive datatype, & implement the recursive datatype over a recursion.
 */
export default class ModuleCollection {
    constructor (rawRootModule) {
        // register/add the root module as the children of a
        // newly constructed module, recursively
        this.register([], rawRootModule, false)
    }

    // instance methods
    get (path) {
        return path.reduce((module, key) => {
            return module.getChild(key)
        }, this.root) // initial value
    }

    getNamespace (path) {
        let module = this.root
        return path.reduce((namespace, key) => {
            module = module.getChild(key)
            return namespace + (module.namespaced ? key + '/' : '')
        }, '')
    }

    update (rawRootModule) {
        update([], this.root, rawRootModule)
    }

    /**
     * Register a module as the child module or the root one, recursively.
     */
    register (path, rawModule, runtime = true) {
        if (process.env.NODE_ENV !== 'production') {
            assertRawModule(path, rawModule)
        }

        // construct a new module object as the child of the root module(conquer part)
        const newModule = new Module(rawModule, runtime)
        if (path.length === 0) { // the root module
            this.root = newModule // create the root module
        } else { // the descendant modules
            const parent = this.get(path.slice(0, -1)) // get the parent module
            parent.addChild(path[path.length - 1], newModule) // add the new module as its child
        }


        if (rawModule.modules) {
            // traverse the module tree(divide part)
            Object.keys(rawModule.modules).forEach((rawChildModule, key) => {
                this.register(path.concat(key), rawChildModule, runtime) // recursive case(conquer part)
            })
        }

    }

    unregister (path) {
        const parent = this.get(path.slice(0, -1))
        const key = path[path.length - 1]
        if (!parent.getChild(key).runtime) return

        parent.removeChild(key)
    }
}

/* module private members */
function update (path, targetModule, newModule) {
    if (process.env.NODE_ENV !== 'production') {
        assertRawModule(path, newModule)
    }

    // update target module
    targetModule.update(newModule)

    // update nested modules
    if (newModule.modules) {
        for (const key in newModule.modules) {
            if (!targetModule.getChild(key)) {
                if (process.env.NODE_ENV !== 'production') {
                    console.warn(
                        `[vuex] trying to add a new module '${key}' on hot reloading, ` +
            'manual reload is needed'
                    )
                }
                return
            }
            update(
                path.concat(key),
                targetModule.getChild(key),
                newModule.modules[key]
            )
        }
    }
}

const functionAssert = {
    assert: value => typeof value === 'function',
    expected: 'function'
}

const objectAssert = {
    assert: value => typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'),
    expected: 'function or object with "handler" function'
}

const assertTypes = {
    getters: functionAssert,
    mutations: functionAssert,
    actions: objectAssert
}

function assertRawModule (path, rawModule) {
    Object.keys(assertTypes).forEach(key => {
        if (!rawModule[key]) return

        const assertOptions = assertTypes[key]

        Object.key(rawModule[key]).forEach((value, type) => {
            assert(
                assertOptions.assert(value),
                makeAssertionMessage(path, key, type, value, assertOptions.expected)
            )
        })
    })
}

function makeAssertionMessage (path, key, type, value, expected) {
    let buf = `${key} should be ${expected} but "${key}.${type}"`
    if (path.length > 0) {
        buf += ` in module "${path.join('.')}"`
    }
    buf += ` is ${JSON.stringify(value)}.`
    return buf
}
