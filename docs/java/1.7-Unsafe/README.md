---
sidebarDepth: 0
---

# unsafe

[[toc]]

## 通过Unsafe类可以分配内存，可以释放内存

```java
   方法如下：
   public native long allocateMemory(long l);
   public native long reallocateMemory(long l, long l1);
   public native void freeMemory(long l);
```

## 偏移量的获取
- 字段的定位：JAVA 对象定位staticFieldOffset方法实现，该方法返回给定field的内存地址偏移量，这个值对于给定的filed是唯一的且是固定不变的。
  - getIntVolatile方法获取对象中offset偏移地址对应的整型field的值,支持volatile load语义。
  - getLong方法获取对象中offset偏移地址对应的long型field的值。

- 数组元素定位：
  - Unsafe类中有很多以BASE_OFFSET结尾的常量，比如ARRAY_INT_BASE_OFFSET，ARRAY_BYTE_BASE_OFFSET等，这些常量值是通过arrayBaseOffset方法得到的。
  > arrayBaseOffset方法是一个本地方法，可以获取数组第一个元素的偏移地址。
  - Unsafe类中还有很多以INDEX_SCALE结尾的常量，比如 ARRAY_INT_INDEX_SCALE ， ARRAY_BYTE_INDEX_SCALE等，这些常量值是通过arrayIndexScale方法得到的。
  > arrayIndexScale方法也是一个本地方法，可以获取数组的转换因子，也就是数组中元素的增量地址。

  > 将arrayBaseOffset与arrayIndexScale配合使用，可以定位数组中每个元素在内存中的位置。

## 挂起与恢复
- park方法：线程挂起，当中断或者超时时停止；
- unpark方法：终止线程挂起，恢复正常；

## CAS操作
   obj 对象偏移offset的（int属性）Filed值与期望值是否相等，若相等，则更新

```java
/**
* 比较obj的offset处内存位置中的值和期望的值，如果相同则更新。此更新是不可中断的。
*
* @param obj 需要更新的对象
* @param offset obj中整型field的偏移量
* @param expect 希望field中存在的值
* @param update 如果期望值expect与field的当前值相同，设置filed的值为这个新值
* @return 如果field的值被更改返回true
*/
public native boolean compareAndSwapInt(Object obj, long offset, int expect, int update);
```