---
sidebarDepth: 0
---

# executor

[[toc]]

## Execute接口方法

  void execute(Runnable command);

- 该接口的中command可能会提交给以下三种方式中的线程
  - new thread
  - poolled thread
  - calling thread
- 可能会抛出异常
  - command null， throw NullExecuption
  - task 不能够被执行，则报RejectedExecutionException异常
- 可能是同步执行也可能是异步执行，取决于具体怎么去实现。

## ExecutorService 继承自Execute接口

- shutdown 方法保证执行的方法能够执行完毕（不再接受新任务），shutdownnow则暴力退出，isShutdown判断是否退出；
- isTerminated用于判断shutdown 和 shutdownnow执行完后以后，任务是否完全执行完。这个任务是否包含队列中的任务？？？待定
- awaitTermination 方法：任务执行完毕，超时，或者线程中断，会停止阻塞；
- submit方法（会发生阻塞） 传值runnable需要指定Rusult的类型，因为runnable接口没有保存返回值，callable接口则不需要。Executo的内部静态类 RunnableAdapter中兼容一下runnable
- invokeAll、invokeAny是同步方法，submit会发生阻塞

## Future接口分析
- cancel方法，isCancel、isDone方法
  - 参数mayInterruptIfRunning，表示是否需要中断正在执行的任务；
  - 接口方法实现需要定义task的状态。
  - 已经取消、完成或者其他原因，返回false;
  - 该接口执行完，isCancel 和isDone 返回true;
- get方法，阻塞队列，使用头部插入到阻塞队列，删除节点的时候也是从头结点删除
  > 延伸知识点：UNSAFE.park 线程挂起，线程将会阻塞到超时或者中断等条件出现。unpark终止挂起，恢复正常。

## LockSupport（线程阻塞）
- unpark方法 和park方法（parkNanos、parkUntil、parkNanos）
  - park方法：阻塞线程，unpark方法：恢复正常
  - 两个方法之间没有时序性；
  - park和unpark 方法：
  > permit 许可通过变量_count 参数设置，unpark 方法设置为1，park方法会首先判断>0?，满足条件，返回：超时时，返回；其他情况阻塞；
- getObjectVolatile是为了在不加锁的情况下保证数组中元素的一致性。
- LockSupport.park是线程阻塞，Thread.interrupt是线程中断，从功能上讲LockSupport.park相当于Thread.wait();
