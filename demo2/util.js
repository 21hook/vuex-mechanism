export function isObject (obj) {
    return obj !== null && typeof obj === 'object'
}

export function assert (condition, msg) {
    if (!condition) throw new Error(`[vuex] ${msg}`)
}
