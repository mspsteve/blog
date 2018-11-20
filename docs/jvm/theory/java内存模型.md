---
sidebarDepth: 0
---

# java内存模型

[[toc]]

## happen-before原则
&emsp;&emsp;happen-before关系是用来描述两个操作的可见性。具体原则可以分为以下8种：

- 单线程：在同一个线程中，书写在前面的操作happen-before后面的操作。
- 锁：同一个锁的`unlock`操作happen-before此锁的lock操作。
- volatile：对一个volatile变量的写操作happen-before对此变量的任意操作(当然也包括写操作了)。
- 传递性：如果A操作 happen-before B操作，B操作happen-before C操作，那么A操作happen-before C操作。
- 线程启动：同一个线程的`start`方法happen-before此线程的其它方法。
- 线程中断：对线程`interrupt`方法的调用happen-before被中断线程的检测到中断发送的代码。
- 线程终结：线程中的所有操作都happen-before线程的终止检测。
- 对象创建：一个对象的初始化完成先于他的`finalize`方法调用。

## 基本概念

- 原子性，是指在一个操作中，CPU不可以在中途暂停然后再调度，即不被中断操作，要不执行完成，要不就不执行。
- 可见性，是指当多个线程访问同一个变量时，一个线程修改了这个变量的值，其他线程能够立即看得到修改的值。
- 有序性，即程序执行的顺序按照代码的先后顺序执行。

&emsp;&emsp;缓存一致性问题其实就是可见性问题，而处理器优化是可以导致原子性问题的，指令重排即会导致有序性问题。
为了保证共享内存的正确性（可见性、有序性、原子性），java内存模型定义了共享内存系统中多线程程序读写操作行为的规范，
其目的是解决由于多线程通过共享内存进行通信时，存在的本地内存数据不一致、编译器会对代码指令重排序、处理器会对代码乱序执行等带来的问题。
下面是java内存模型的结构图：<br>
![jvm-内存模型](./jvm-8.png)

## 使用内存屏障

### 硬件级别
- 硬件层的内存屏障分为两种：`Load Barrier`和`Store Barrie`r即读屏障和写屏障。
:::tip
内存屏障有两个作用：<br>
阻止屏障两侧的指令重排序；<br>
强制把写缓冲区/高速缓存中的脏数据等写回主内存，让缓存中相应的数据失效。
:::
- 对于`Load Barrier`来说，在指令前插入`Load Barrier`，可以让高速缓存中的数据失效，强制从新从主内存加载数据；
- 对于`Store Barrier`来说，在指令后插入`Store Barrier`，能让写入缓存中的最新数据更新写入主内存，让其他线程可见。

### java内存屏障

&emsp;&emsp;java的内存屏障通常所谓的四种即LoadLoad,StoreStore,LoadStore,StoreLoad实际上也是上述两种的组合，
完成一系列的屏障和数据同步功能。具体如下：

- `LoadLoad`屏障：对于这样的语句Load1; `LoadLoad`; Load2，在Load2及后续读取操作要读取的数据被访问前，保证Load1要读取的数据被读取完毕。
- `StoreStore`屏障：对于这样的语句Store1; `StoreStore`; Store2，在Store2及后续写入操作执行前，保证Store1的写入操作对其它处理器可见。
- `LoadStore`屏障：对于这样的语句Load1; `LoadStore`; Store2，在Store2及后续写入操作被刷出前，保证Load1要读取的数据被读取完毕。
- `StoreLoad`屏障：对于这样的语句Store1; `StoreLoad`; Load2，在Load2及后续所有读取操作执行前，保证Store1的写入对所有处理器可见。
它的开销是四种屏障中最大的。在大多数处理器的实现中，这个屏障是个万能屏障，兼具其它三种内存屏障的功能

### volatile语义中的内存屏障

- volatile的内存屏障策略非常严格保守，非常悲观且毫无安全感的心态：
:::tip
在每个volatile写操作前插入StoreStore屏障，在写操作后插入StoreLoad屏障；<br>
在每个volatile读操作前插入LoadLoad屏障，在读操作后插入LoadStore屏障；
:::
- 由于内存屏障的作用，避免了volatile变量和其它指令重排序、线程之间实现了通信，使得volatile表现出了锁的特性。

### final语义中的内存屏障

- 对于final域，编译器和CPU会遵循两个排序规则：
:::tip
新建对象过程中，构造体中对final域的初始化写入和这个对象赋值给其他引用变量，这两个操作不能重排序；（废话嘛）<br>
初次读包含final域的对象引用和读取这个final域，这两个操作不能重排序；（晦涩，意思就是先赋值引用，再调用final值）
:::
- 总之上面规则的意思可以这样理解，必需保证一个对象的所有final域被写入完毕后才能引用和读取。这也是内存屏障的起的作用：
- 写final域：在编译器写final域完毕，构造体结束之前，会插入一个StoreStore屏障，保证前面的对final写入对其他线程/CPU可见，并阻止重排序。
- 读final域：在上述规则2中，两步操作不能重排序的机理就是在读final域前插入了LoadLoad屏障。
- X86处理器中，由于CPU不会对写-写操作进行重排序，所以StoreStore屏障会被省略；而X86也不会对逻辑上有先后依赖关系的操作进行重排序，所以LoadLoad也会变省略。

## 限制处理器优化(mark一下，有时间处理)












