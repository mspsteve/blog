---
sidebarDepth: 0
---

# jvm方法句柄

[[toc]]

## 基本概念

&emsp;&emsp;方法句柄是一个强类型的，能够被直接执行的引用。该引用可以指向常规的静态方法、实例方法、构造器或者字段。
方法句柄的类型（`MethodType`）是由所指向方法的参数类型以及返回类型组成的,是确定方法句柄是否适配的唯一关键。
:::tip
当指向字段时，方法句柄实则指向包含字段访问字节码的虚构方法，语义上等价于目标字段的`getter`或者`setter`方法。
这里需要注意的是，它并不会直接指向目标字段所在类的`getter/setter`，毕竟无法保证已有的`getter/setter`方法就是在访问目标字段。
:::

```java
public class MethodHandleTest {
    private static String bar(String str) {
        return str;
    }

    public static MethodHandles.Lookup lookup() {
        return MethodHandles.lookup();
    }

    public static void main(String[] args) throws Throwable {
        //具备MethodHandleTest类的访问权限
        MethodHandles.Lookup l = MethodHandleTest.lookup();

        //反射方式
        Method m = MethodHandleTest.class.getDeclaredMethod("bar", String.class);
        MethodHandle mh0 = l.unreflect(m);

        // 利用findstatic
        MethodType t = MethodType.methodType(String.class, String.class);
        MethodHandle mh1 = l.findStatic(MethodHandleTest.class, "bar", t);

        // 使用
        String v1 = (String) mh0.invokeExact( "maoshiping");
        String v2 = (String) mh0.invokeExact( "maoshiping");
    }
}
```
&emsp;&emsp;方法句柄的创建是通过`MethodHandles.Lookup`类来完成。方法句柄的获取：
- 使用反射API的Method来查找
- 根据类、方法名以及方法句柄来查找
:::warning
使用`invokestatic`调用的静态方法，需要使用`Lookup.findStatic`方法<br>
使用`invokevirtual`调用的实例方法以及`invokeinterface`调用的接口方法，需要使用`findVirtual`方法<br>
使用`invokespecial`调用的实例方法，需要使用`findSpecial`方法<br>
:::
&emsp;&emsp;调用方法句柄，和原本对应的调用指令是一致的。也就是说，对于原本用`invokevirtual`调用的方法句柄，它也会采用动态绑定；
而对于原本用`invokespecial`调用的方法句柄，它会采用静态绑定。

## 使用

&emsp;&emsp;方法句柄提供调用以及增删改等操作，具体如下：
- invokeExact方法要求严格类型匹配(包括传参和返回值)，只要类型不能匹配就会报错
- invoke参数类型松散匹配，通过`asType`自动适配
- MethodHandle.asType方法来修改传参
- MethodHandles.dropArguments方法来删除部分传入的参数，再调用另一个方法句柄
- MethodHandle.bindTo方法在传参中插入额外的参数，再调用另外一个方法句柄

## 实现原理

看不懂，没有彻底整明白，有时间再研究

## 与反射区别

- Reflection是在模拟java代码层次的方法调用，而MethodHandle是在模拟字节码层次的方法调用
- 信息上讲，Reflection是重量级，而MethodHandle是轻量级
:::tip
Reflection包含了方法的签名、描述符以及方法属性表中各种属性的java端表示方式，还包含有执行权限等的运行期信息。<br>
MethodHandle仅仅包含着与执行该方法相关的信息。
:::
- MethodHandle可以实现字节码级别的各种优化(方法内联)，Reflection去调用方法则不行
- MethodHandle字节码层面的实现，也可以支持其他语言，Reflection则不可以

