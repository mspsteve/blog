---
sidebarDepth: 0
---

# jvm 反射原理

[[toc]]

## 应用

&emsp;&emsp;反射使用：
```java
  Class<?> clazz = Class.forName("...");
  Method method = clazz.getMethod("methodName", Object objectParam);
  Object obj = method.invoke(clazz.newInstance(), objectParam ... );
```

## 实现原理

```java
 @CallerSensitive
    public Object invoke(Object obj, Object... args)
        throws IllegalAccessException, IllegalArgumentException,
           InvocationTargetException
    {
        if (!override) {
            if (!Reflection.quickCheckMemberAccess(clazz, modifiers)) { //检查反射的权限
                Class<?> caller = Reflection.getCallerClass();
                checkAccess(caller, clazz, obj, modifiers);
            }
        }
        MethodAccessor ma = methodAccessor;             // 委派给MethodAccessor
        if (ma == null) {
            ma = acquireMethodAccessor();
        }
        return ma.invoke(obj, args);
    }
```

&emsp;&emsp;Method.invoke上委派给MethodAccessor来处理。MethodAccessor是一个接口，具体实现有种方式：一个通过本地方法来实现反射调用(`NativeMethodAccessorImpl`)，
另外一种是委派模式(`DelegatingMethodAccessorImpl`)。Method.invoke实现过程：首先调用委派实现，再根据setMethodAccessor方法进入到本地实现。具体见如下：

```java
 // 设置具体的实现方式，保留着可扩展性
 DelegatingMethodAccessorImpl(MethodAccessorImpl var1) {
        this.setDelegate(var1);
    }
 public Object invoke(Object var1, Object[] var2) throws IllegalArgumentException, InvocationTargetException {
        return this.delegate.invoke(var1, var2);
 }
```

&emsp;&emsp;java的反射调用机制还设立了另一种动态生成字节码的实现（下文称为动态实现），直接使用invoke指令来调用目标方法。
之所以采用委派实现，便是为了能够在本地实现以及动态实现中切换(**没有看出来**)。<br>
&emsp;&emsp;反射调用的inflation机制是可以通过参数（-Dsun.reflect.noInflation=true)来设置。java虚拟机设置默认阈值为15，实现本地实现和动态实现的切换，
（可以通过`-Dsun,reflect.inflationThreshold`=来调整），这个过程我们称之为inflation。具体参见`NativeMethodAccessorImpl`代码实现：

```java
 public Object invoke(Object var1, Object[] var2) throws IllegalArgumentException, InvocationTargetException {
        if (++this.numInvocations > ReflectionFactory.inflationThreshold() && !ReflectUtil.isVMAnonymousClass(this.method.getDeclaringClass())) {
            MethodAccessorImpl var3 = (MethodAccessorImpl)(new MethodAccessorGenerator()).generateMethod(this.method.getDeclaringClass(), this.method.getName(), this.method.getParameterTypes(), this.method.getReturnType(), this.method.getExceptionTypes(), this.method.getModifiers());
            this.parent.setDelegate(var3);
        }

        return invoke0(this.method, var1, var2);
    }
```

## 反射的性能开销

- 查找方法

&emsp;&emsp; `getMethod`或`getMethods`等查找方法操作会返回查找得到结果的一份拷贝。因此，应当避免避免在热点代码中使用以减少不必要的堆空间消耗，
或者缓存`Class.forName`和`Class.getMethod`结果。具体代码如下：

```java
 private Method getMethod0(String name, Class<?>[] parameterTypes, boolean includeStaticMethods) {
        MethodArray interfaceCandidates = new MethodArray(2); //消耗资源的地方
        Method res =  privateGetMethodRecursive(name, parameterTypes, includeStaticMethods, interfaceCandidates);
        if (res != null)
            return res;

        // Not found on class or superclass directly
        interfaceCandidates.removeLessSpecifics();
        return interfaceCandidates.getFirst(); // may be null
    }
```

- Object数组

&emsp;&emsp;由于`Method.invoke`是一个变长参数方法，在字节码层面它的最后一个参数会是Object数组。
java编译器会在方法调用处生成一个长度为传入参数数量的Object数组， 并将传入参数一一存储进该数组中。
由于Object数组不能存储基本类型，java编译器会对传入的基本类型参数进行自动装箱。可能会占用堆内存，使得GC更加频繁<br>

- 优化方案

## 反射API简介

### 获取class对象

- 调用静态方法Class.forName
- 调用对象的getClass()方法
- 直接用类名 + ".class"来访问
:::tip
Integer.TYPE指向int.class。对于数组类型来说，可以使用类名+“[].class”来访问，如int[],class。<br>
Class类和java.lang.reflect包中还提供了许多返回Class对象的方法。例如，对于数组类的Class对象，调用Class.getComponentType()方法可以获得数组元素的类型。
:::

### 反射API

- 使用newInstance()来生成一个该类的实例，它要求该类中拥有一个无参数构造器
- 使用isInstance(Object)来判断一个对象是否该类的实例，语法上等同于instanceof关键字（JIT优化时会有差别）
- 使用Array.newInstance(Class,int)来构造该类型的数组
- 使用getFields()/getConstructors()/getMethods()来访问该类的成员。
- 使用Constructor/Field/Method.setAccessible(true)来绕开Java语言的访问限制
- 使用Constructor.newInstance(Object[])来生成类的实例
- 使用Field.get/set(Object)来访问字段的值
- 使用Method.invoke(Object, Object[])来调用方法





























