# Vuex Patterns
> Design patterns in Vuex

## Key concepts
publish-subscriber pattern, recursive data type  

## Mechanisms
Define a fn subscriber of the store object, providing a function to be called when the store object is committed.
Define a list of actions to be dispatched, commit the action type & payload data to the development tool when 
the store object is committed.
Create a ModuleCollection class which is a recursive datatype. Implement the Module class storing a collection of 
fields: actions, mutations, & getters, which is the base case. Implement the ModuleCollection class adding each module 
object as its children, recursively.
Add getter methods of each module of the store object as computed properties of the Vue components. When the state 
property of a module is mutated, the updated state will output & render into component tree, automatically.

## Table of contents
1. [Commit messages](#demo1-commit-messagessource)
2. [Action dispatch](#demo2-action-dispatchsource)
3. [ModuleCollection - recursive datatype](#demo3-modulecollection---recursive-datatypesource)
4. [Getters](#demo4-getterssource)


## Demo1: Commit messages([Source](https://github.com/21hook/vuex-mechanism/tree/master/demo1))


## Demo2: Action dispatch([Source](https://github.com/21hook/vuex-mechanism/tree/master/demo2))
1. Define Subject and Observer class
2. when a subject object change state, all registered observers are notified and
updated automatically.

Vue components dispatch actions to commit the mutations, each of which will mutate 
the state; When the state is changed, the listeners in the Vue components subscribed the change will be 
notified & updated, & render the component tree.

## Demo3: ModuleCollection - recursive datatype([Source](https://github.com/21hook/vuex-mechanism/tree/master/demo3))

## Demo4: Getters([Source](https://github.com/21hook/vuex-mechanism/tree/master/demo4))

## Vuex architecture
1. 

2. 

## License
MIT

## References
1. <br>
2. 
