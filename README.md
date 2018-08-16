# Vuex
> vuex implementation mechanism

[README 中文](https://github.com/21hook/vuex-mechanism/blob/master/README-zh_cn.md)

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
property of a module is mutated, the update state will output & render into component tree, automatically.

## Table of contents
1. [Commit messages](#demo1-commit-messagessource)
2. [Action dispatch](#demo2-action-dispatchsource)
3. [ModuleCollection - recursive datatype](#demo3-modulecollection---recursive-datatypesource)
4. [Getters](#demo4-getterssource)


## Demo1: Commit messages([Source](https://github.com/21hook/vuex-mechanism/tree/master/demo1))
Define a fn subscriber of a store object. When the store is committed, the fn handler is triggered which 
emit the mutation message & arg to the development tool. Then the development tool
trigger the mutation handler, show the update state.

## Demo2: Action dispatch(分发/下发指令，动作)([Source](https://github.com/21hook/vuex-mechanism/tree/master/demo2))
Define a list of actions to be dispatched. The action is dispatched, then the action type &
payload data are committed into the development too.

## Demo3: ModuleCollection - recursive datatype([Source](https://github.com/21hook/vuex-mechanism/tree/master/demo3))
Define a ModuleCollection class, which store a ref to a recursive datatype using a module object
as its base case. The constructor case of a module collection uses a module as its children nodes.
Then, install the module actions, mutations, & getters from the module tree defined by the module arg of 
the store object.

## Demo4: Getters([Source](https://github.com/21hook/vuex-mechanism/tree/master/demo4))
Add the getters of each module of a store as computed properties of the Vue components.
When mutating the state property of the module, the update state will output & render
into the component tree.(single way data-binding)

## Vuex architecture
1. 
Add Vue components as subscribers of the store state, 
& trigger actions to handle user inputs
```             
               add                       trigger  
    State -------------> Vue components - - - - -> Users
                           
```

2. 
Dispatch actions, emit mutations, & render components
```         
                    dispatch            commit              emit  
    Vue components ----------> Actions --------> Mutations - - - -> Development tool
        |                                             |
         <------------------    State  <--------------
                render                    mutate              
    
```

## License
MIT

## References
1. Wikipedia [Observer pattern](https://en.wikipedia.org/wiki/Observer_pattern)
