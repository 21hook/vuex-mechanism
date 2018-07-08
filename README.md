# Vuex Patterns
> Design patterns in Vuex

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
1. [Commit messages](#)
2. [Action dispatch](#)
3. [ModuleCollection - recursive datatype](#)
4. [Getters](#)


## Commit messages([Source](https://))


## Action dispatch([Source](https://))
1. Define Subject and Observer class
2. when a subject object change state, all registered observers are notified and
updated automatically.

Vue components dispatch actions to commit the mutations, each of which will mutate 
the state; When the state is changed, the listeners in the Vue components subscribed the change will be 
notified & updated, & render the component tree.

## ModuleCollection - recursive datatype([Source](https://))

## Getters([Source](https://))

## Vuex architecture
1. 

2. 

## License
MIT

## References
1. <br>
2. 
