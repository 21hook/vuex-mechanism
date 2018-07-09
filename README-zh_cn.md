# Vuex Patterns
> Vuex中的设计模式

[README English](https://github.com/21hook/vuex-mechanism/blob/master/README.md)

## 关键概念
发布-订阅模式，递归数据类型

## 原理
定义store对象的fn订阅者，提供在commit store对象时要调用的回调函数。
定义要分发/派遣的action列表，将action类型和(payload)[https://en.wikipedia.org/wiki/Payload_(computing)] data提交给开发者工具
当存储对象被提交的时候。
创建一个ModuleCollection类，它是一个递归数据类型。实现一个Module类包括以下
字段:actions、mutations和getters作为base case。实现ModuleCollection类，递归地添加每个模块
对象作为它的子对象。
将store对象的每个模块的getter方法添加为Vue组件的计算属性。当
模块的state属性改变时，更新状态将自动地输出和渲染到组件树中。

## 目录
1. [Commit messages](#demo1-commit-messagessource)
2. [Action dispatch](#demo2-action-dispatchsource)
3. [ModuleCollection - recursive datatype](#demo3-modulecollection---recursive-datatypesource)
4. [Getters](#demo4-getterssource)

## Demo1: Commit messages([Source](https://github.com/21hook/vuex-mechanism/tree/master/demo1))
定义store对象的fn订阅者。在commit store时，将触发fn处理回调。
向开发者工具发送mutation消息和参数。然后,开发工具
触发自己的处理程序，在Vuex控制台显示更新状态。

## Demo2: Action dispatch([Source](https://github.com/21hook/vuex-mechanism/tree/master/demo2))
定义要分发的action列表。下发一个动作，并且提交action类型&
payload data到开发者工具中。

## Demo3: ModuleCollection - recursive datatype([Source](https://github.com/21hook/vuex-mechanism/tree/master/demo3))
定义一个ModuleCollection类，存储一个以module对象作为base case的递归数据类型的引用。
module collection对象的constructor case使用module对象作为其子节点。
然后，从store对象的module参数定义的module tree中安装模块actions、mutations和getters。

## Demo4: Getters([Source](https://github.com/21hook/vuex-mechanism/tree/master/demo4))
将存储的每个模块的getter添加为Vue组件的计算属性。
当修改模块的状态属性时，更新状态将自动地输出和渲染到组件树中。(单向数据绑定)

## Vuex architecture
1. 
添加store state作为Vue components视图的订阅者，&下发actions去处理用户输入
```             
               add                       trigger  
    State -------------> Vue components - - - - -> Users
                       
```

2. 
下发actions, 发布mutations, &渲染组件
```         
                    dispatch            commit               emit  
    Vue components ----------> Actions --------> Mutations - - - -> Development tool
        |                                             |
         <------------------    State  <--------------
            output & render                mutate              
    
```


## License
MIT

## References
1. Wikipedia [Observer pattern](https://en.wikipedia.org/wiki/Observer_pattern)
