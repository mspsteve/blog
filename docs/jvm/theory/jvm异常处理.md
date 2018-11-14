---
sidebarDepth: 0
---

# jvm异常处理

[[toc]]

## 基本概念

&emsp;&emsp;所有异常都是Throwable类或者其子类的实例。Throwable有两大之类:`Error`涵盖程序不应捕获的异常,当程序触发`Error`时，
它的执行状态已经无法恢复，需要中止线程甚至是中止虚拟机。`Exception`涵盖程序可能需要捕获并且处理的异常。具体如下图：
![jvm异常处理-1](./jvm-5.png)
:::tip
Exception 有一个特殊的子类`RuntimeException`,用来表示“程序虽然无法继续执行，但是还能抢救一下”的情况.
:::
&emsp;&emsp;`RuntimeException`和`Error`属于java里的非检查异常（`unchecked exception`），其他异常则属于检查异常（`checked exception`）。
check异常需要程序显式捕获或者在方法声明中用throws关键字标注。通常情况，自定义异常通常为检查异常。



## 异常捕获流程

- try代码块：用来标记需要进行异常监控的代码。
- catch代码块：跟在try代码块之后，用来捕获在try代码块中触发的某种指定类型的异常。
:::tip
&emsp;&emsp;除了声明所捕获异常的类型之外，catch代码块还定义了针对对该异常类型的异常处理器。在java中，try代码块后面可以跟着多个catch代
码块，来捕获不同类型的异常。java虚拟机会从上至下匹配异常处理器。因此，前面的catch代码块所捕获的异常类型不能覆盖后边的，否则编译器会报错。
:::
- finally代码块：跟在try代码块和catch代码块之后，用来声明一段必定运行的代码。它的设计初衷是为了避免跳过某些关键的清理代码，例如关闭已打开的系统资源。

## 原理

### 异常实例构造
&emsp;&emsp;java虚拟机在构造异常实例时需要生成该异常的栈轨迹（`stack trace`）。该操作会逐一访问当前线程的java栈帧，并且记录下各种调试信息，
包括栈帧所指向的方法的名字，方法所在的类名、文件名，以及在代码中的第几行触发该异常。生成栈轨迹时,java虚拟机会忽略掉异常构造器以及填充栈帧的java方法
（`Throwable.fillInStackTrace`）,直接从新建异常位置开始算起。此外，java虚拟机还会忽略标记为不可见的java方法栈帧。异常栈的内容如下：
- 异常栈以FILO的顺序打印，位于打印内容最下方的异常最早被抛出，逐渐导致上方异常被抛出。
:::tip
位于打印内容最上方的异常最晚被抛出，且没有再被捕获。从上到下数，第i+1个异常是第i个异常被抛出的原因`cause`，以`Caused by`开头。
:::
- 异常栈中每个异常都由异常名+细节信息+路径组成。
:::tip
异常名从行首开始（或紧随`Caused by`），紧接着是细节信息（为增强可读性，需要提供恰当的细节信息），从下一行开始，跳过一个制表符，就是路径中的一个位置，一行一个位置。
:::
- 路径以FIFO的顺序打印，位于打印内容最上方的位置最早被该异常经过，逐层向外抛出。
:::tip
最早经过的位置即是异常被抛出的位置，逆向debug时可从此处开始；后续位置一般是方法调用的入口，java虚拟机捕获异常时可以从方法栈中得到。
对于`cause`，其可打印的路径截止到被包装进下一个异常之前，之后打印“… 6 more”，表示`cause`作为被包装异常，在这之后还逐层向外经过了6个位置，但这些位置与包装异常的路径重复，
所以在此处省略，而在包装异常的路径中打印。
:::

### 实现原理
&emsp;&emsp;在编译生成的字节码中，每个方法都附带一个异常表。异常表中的每一个条目都代表一个异常处理器，并且由`from指令`、`to指令`、`target指令`以及所捕获的异常类型构成。
这些指针的值是字节码索引（`bytecode index`, `bci`），用以定位字节码。<br>
&emsp;&emsp;其中，from指针和to指针标示了该异常处理器所监控的范围，例如try代码所覆盖的范围。target指针则指向异常处理器的起始位置。
```java
public static void main(String[] args){
    try{
        mayThrowException();
    } catch(Exception e){
        e.printStackTrace();
    }
}

//对应的Java字节码
public static void main(java.lang.String[]);
    Code:
        0: invokestatic mayThrowException:()V
        3: goto 11
        6: astore_1
        7: aload_1
        8: invokevirtual java.lang.Exception.printStackTrace
       11: return
     Exception table:
        from    to    target    type
          0     3     6         Class java/lang/Exception //异常表条目

```

&emsp;&emsp;当程序触发异常时，java虚拟机会从上至下遍历异常表中的所有条目。当触发异常的字节码的索引值在某个异常表监控范围内，java虚拟机会判断所抛出的异常和该条目想要捕获的异常是否匹配。
如果匹配，java虚拟机会将控制流转移至该条目`target`指针指向的字节码。<br>
&emsp;&emsp;如果遍历完所有异常表条目，java虚拟机仍未匹配到异常处理器，那么它会弹出当前方法对应的java栈帧,并且在调用者(`caller`)中重复上述操作。
在最坏情况下，java虚拟机需要遍历当前线程java栈上所有方法的异常表。<br>
&emsp;&emsp;`finally`代码块的编译比较复杂。当前版本Java编译器的做法，是复制`finally`代码块的内容，分别放在`try-catch`代码块所有正常执行路径以及异常执行路径的出口中。具体见下图：
![jvm异常处理-2](./jvm-5.1.png)
&emsp;&emsp;针对异常执行路径，java编译器会生成一个或多个异常表条目，监控整个`try-catch`代码块，并且捕获所有种类的异常（在`javap`中以`any`指代）。
这些异常表条目的`target`指针将指向另一份复制的`finally`代码块。并且在`finally`代码块的最后，java编译器会重新抛出所捕获的异常。
```java
public class Foo {
  private int tryBlock;
  private int catchBlock;
  private int finallyBlock;
  private int methodExit;

  public void test() {
    try {
      tryBlock = 0;
    } catch (Exception e) {
      catchBlock = 1;
    } finally {
      finallyBlock = 2;
    }
    methodExit = 3;
  }
}

//使用javap 查询字节码
Compiled from "Foo.java"
public class Foo {
  public Foo();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public void test();
    Code:
       0: aload_0
       1: iconst_0
       2: putfield      #2                  // Field tryBlock:I
       5: aload_0
       6: iconst_2
       7: putfield      #3                  // Field finallyBlock:I
      10: goto          35
      13: astore_1
      14: aload_0
      15: iconst_1
      16: putfield      #5                  // Field catchBlock:I
      19: aload_0
      20: iconst_2
      21: putfield      #3                  // Field finallyBlock:I
      24: goto          35
      27: astore_2
      28: aload_0
      29: iconst_2
      30: putfield      #3                  // Field finallyBlock:I
      33: aload_2
      34: athrow
      35: aload_0
      36: iconst_3
      37: putfield      #6                  // Field methodExit:I
      40: return
    Exception table:
       from    to  target type
           0     5    13   Class java/lang/Exception
           0     5    27   any
          13    19    27   any
}
```
:::tip
字节码编译结果包含三份`finally`代码块。其中，前两份分别位于`try`代码块和`catch`代码块的正常执行路径出口。
最后一份则作为异常处理器，监控`try`代码块以及`catch`代码块。它将捕获`try`代码块触发的、未被`catch`代码块捕获的异常，以及`catch`代码块触发的异常。
:::
:::warning
  如果catch代码块捕获了异常，并且触发了另一个异常，那么finally捕获并且重拋的异常是哪个呢？
  答案是后者。也就是说原本的异常便会被忽略掉，这对于代码调试来说十分不利。
:::

## java7的Supressed异常以及语法糖

### Supressed异常

&emsp;&emsp;Supressed异常新特性允许开发人员将一个异常附于另一个异常之上。因此，抛出的异常可以附带多个异常信息。
然而，`finally`代码块缺少指向所捕获异常的引用，所以这个新特性使用起来十分繁琐。java7专门构造了一个名为`try-with-resources`的语法糖，
在字节码层面自动使用Supressed异常。当然，该语法糖的主要目的并不是使用Supressed异常，而是精简资源打开关闭的用法。下面是java7 版本之前的资源关闭：

```java
FileInputStream in0 = null;
FileInputStream in1 = null;
FileInputStream in2 = null;
...
try{
    in0 = new FileInputStream(new File("in0.txt"));
    ...
    try{
        in1 = new FileInputStream(new File("in1.txt"));
        ...
        try{
            in2 = new FileInputStream(new File("in2.txt"));
            ...
        } finally{
            if(in2 != null)
                in2.close();
        }
    }
    finally{
        if(in1 != null)
            in1.close();
    }
} finally{
    if(in0 != null)
        in0.close();
}
```
&emsp;&emsp;java7的`try-with-resources`语法糖极大地简化了上述代码。程序可以在try关键字后声明并实例化实现了AutoCloseable接口类，编译器将自动添加对应的close()操作。
在声明多个`AutoCloseable`实例的情况下，编译生成的字节码类似于上面手工编写代码的编译结果。与手工代码相比，try-with-resources还会使用Supressed异常的功能，来避免原异常“被消失”。
代码如下：

```java
public class Foo implements AutoCloseable {
	private final String name;
	public Foo(String name) {
		this.name = name;
	}

	@Override
	public void close(){
		throw new RuntimeException(name);
	}

	public static void main(String[] args) {
		try (Foo foo0 = new Foo("Foo0"); //try-with-resources
			 Foo foo1 = new Foo("Foo1");
			 Foo foo2 = new Foo("Foo2")) {
			throw new RuntimeException("Initial");
		}
	}
}
```
&emsp;&emsp;运行结果如下：
```java
javac Foo.java
java Foo
Exception in thread "main" java.lang.RuntimeException: Initial
	at Foo.main(Foo.java:16)
	Suppressed: java.lang.RuntimeException: Foo2
		at Foo.close(Foo.java:9)
		at Foo.main(Foo.java:17)
	Suppressed: java.lang.RuntimeException: Foo1
		at Foo.close(Foo.java:9)
		at Foo.main(Foo.java:17)
	Suppressed: java.lang.RuntimeException: Foo0
		at Foo.close(Foo.java:9)
		at Foo.main(Foo.java:17)
```
&emsp;&emsp;try-with-resources语法糖之外，Java 7 还支持在同一catch代码块中捕获多种异常。实际实现非常简单，生成多个异常表条目即可。代码如下：
```java
//在同一 catch 代码块中捕获多种异常
try {
    ...
} catch (SomeException | OtherException e) {
    ...
}
```



























