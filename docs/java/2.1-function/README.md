---
sidebarDepth: 0
---

# function

[[toc]]

## consumer系列
- 即接口表示一个接受单个输入参数并且没有返回值的操作。Consumer接口期望执行带有副作用的操作(Consumer的操作可能会更改输入参数的内部状态)
- 使用方式：

```java
    User user = new User("zm");
    Consumer<User> userConsumer = User1 -> User1.setName("zmChange");//接受一个参数
    userConsumer.accept(user);
```
-  其他类型：BiConsumer、DoubleConsumer、IntConsumer、LongConsumer、ObjDoubleConsumer

## predicate系列
- Predicate功能判断输入的对象是否符合某个条件，传参为T
- 使用方式

```java
Predicate<Integer> boolValue = x -> x > 5；其中，x为变量，x > 5为test函数体内容
```
- BiPredicate 实现test(T t, U u), 两个参数
- DoublePredicate、IntPredicate、LongPredicate

## function系列

- 将Function对象应用到输入的参数上，然后返回计算结果
- 使用方式

```java
    System.out.println(validInput(name, inputStr -> inputStr.isEmpty() ? "名字不能为空":inputStr));
    public static String validInput(String name,Function<String,String> function) {
		return function.apply(name);
	}
```

- 其他类型：BiFunction、IntFunction、DoubleToIntFunction、DoubleToLongFunction、LongFunction、
  LongToDoubleFunction、LongToIntFunction、ToDoubleFunction、ToIntBiFunction、ToIntFunction、ToLongBiFunction、ToLongFunction

## Supplier系列

- Supplier接口没有入参，返回一个T类型的对象，类似工厂方法
- 使用方式：
```java
    Supplier<User> supplier = ()->new User();
    User user = supplier.get();
```
- BooleanSupplier、DoubleSupplier、IntSupplier、LongSupplier
## 其他方法理解
- compose：先执行参数(即也是一个Function)的，再执行调用者(同样是一个Function)
- andThen: 先执行调用者，再执行参数，和compose相反

