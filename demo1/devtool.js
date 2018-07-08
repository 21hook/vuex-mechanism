/**
 * Init the development tool, & define a fn subscriber of the store object, providing
 * a function to be called when the store object is committed.
 */
const devtoolHook =
    typeof window !== 'undefined' &&
    window.__VUE_DEVTOOLS_GLOBAL_HOOK__

export default function devtoolPlugin (store) {
    if (!devtoolHook) return

    store._devtoolHook = devtoolHook

    devtoolHook.emit('vuex:init', store) // call the interface of the subscribers(the development tool) with the
    // specified
    // param

    devtoolHook.on('vuex:travel-to-state', targetState => {
        store.replaceState(targetState)
    })

    // add the fn subscriber
    store.subscribe((mutation, state) => {
        // emit the message type & arg to the development tool when the fn subscriber is triggered
        devtoolHook.emit('vuex:mutation', mutation, state)
    })
}
