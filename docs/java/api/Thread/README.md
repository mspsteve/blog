---
sidebarDepth: 0
---

# Thread

[[toc]]

## 内部类State

- NEW：线程创建成功，尚未开始
- RUNNABLE：线程正在正常运行中, 会等待操作系统资源的释放（IO等待、耗时计算、CPU时间切换）；
- BLOCKED：阻塞状态
  - 等待监视器（monitor）锁定，通常是synachronized 锁定的代码块或者synachronized 锁定可重入时调用的object.await();
  - 线程在等待进入临界区；
- WAITING：
  - 调用Object.wait和Thread.join非超时状态以及LockSupport.park时，进入等待状态
  - 与block的区别在于在等待其他线程notify 或者unpark；
- IMED_WAITING
  - 调用线程Thread.sleep、Object.wait、Thread.join、LockSupport.parkNanos、LockSupport.parkUntil时，超时处理；
  - 与WAITING区别在于有超时；
- TERMINATED: 线程执行结束；

## isInterrupted() 和interrupted()方法

- isInterrupted()判断线程是否发生中断；
- interrupted()判断线程是否发生中断，若发生，则返回true，并清除中断状态；
- interrupted() 和isInterrupted()
  - 都是调用 native 方法：isInterrupted(boolean ClearInterrupted) ；
  - interrupted传true，isInterrupted()传false，其中true表示清除中断状态，false表示不清除
- interrupte()调用时，线程的状态是Runnable;
- 线程的状态和中断状态是不同的变量来标识的；

## parkBlocker字段表示线程阻塞

## 线程的异常处理机制:UncaughtExceptionHandler

- 首先判断是否实现UncaughtExceptionHandler，如果实现则调用，否则调用ThreadGroup组的默认实现；
- 默认调用system.err记录日志错误信息；

## Thread parent  和ThreadGroup

- ThreadGroup 的功能
  - 提供优先级、是否是驻守线程等功能；
  - 提供基于线程状态的遍历;
  - 提供线程报异常的默认处理方式；
- 线程的创建
  - 线程创建时，使用currentThread()获取父线程，使用父线程的ThreadGroup来给新线程赋值；
- 线程启动
  - 调用ThreadGroup.add方法，默认初始化4个线程数组，随后以2倍的方式递增；
  - 线程的数量+1，未执行的数量减1；
  - 线程移除时-1，未执行数量加1，然后copy，减少数组的量；

## interrupte()操作、blocker、blockerLock

- interrupte()操作在blocker为空时，直接设置中断状态，并不是真正执行中断操作；
- blockedOn 方法中给blocker赋值，当blocker不为空时，会真正调用OS内核操作，具体参见Java NIO
- blockedOn 方法包级私有方法，对外不可见；
- 使用内部私有对象，使用隐性加锁；
- 默认情况下，线程创建以后，都不会给blocker赋值，所以中断以后参见（1）；

## ThreadLocal 与 ThreadLocalMap 以及 Thread的关系

- ThreadLocal 与 ThreadLocalMap
  - ThreadLocalMap 是ThreadLocal 的内部静态类，其中基本的数据结构为Entry;
  - Entry继承自WeakReference< T >，其中使用super(ThreadLocal<?>)，因此Entry的key为弱引用，key的类型为ThreadLocal<?>;
  - Entry的value值为强引用；
- Thread 有ThreadLocalMap对象，用于保存多个ThreadLocal;
- 使用弱引用的意义：
  - 正常的hashMap，key 为强引用，所以不会gc回收；
  - ThreadLocalMap的值为若引用，所以key值在gc时候被回收；
  - ThreadLocal< T > threadLocal = new ThreadLocal()时候，threadLocal.set(key)，之所以new ThreadLocal()不会被回收，是因为有强引用的threadLocal指向；
- inheritableThreadLocals 用于保存父线程的信息，可用于追踪。