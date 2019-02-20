---
sidebarDepth: 0
---

# lock

[[toc]]

## Lock锁

- lock锁可以实现synchronized 关键字能实现相同的功能；lock锁的优势在于可以多个锁获取和释放顺序的灵活性。
- lock() lockInterruptibly() 方法:
   - 线程阻塞直到获取到锁；
   - lockInterruptibly() 线程中断会停止获取锁；
   - lockInterruptibly的某些实现会导致捕获不到中断？（到底是哪一个）
   - lockInterruptibly 方法需要处理检查异常或者死锁情况
- tryLock()方法 同（2）；
- unlock()方法释放锁会导致uncheck异常；
- Condition是lock锁的边界；
  - thread获取lock，然后才可以调用condition.await()方法；
  - 执行condition.await()方法，thread获取的lock锁会自动释放；
  - wait结果返回之前，可以重新获取lock,即condition没有阻塞之前，thread可以重新获取lock;

## Condition条件(实现锁的灵活性)

- await() 、awaitUninterruptibly()、awaitNanos()、awaitUntil()
> Thread 阻塞在condition条件时，将释放锁；
- signal()、signalAll()唤醒线程时，将重新获取锁；

## ConditionObject 继承Condition

   Node类
- 使用nextWaiter，实现一个单向链表；
- 不同的Condition使用不同的单向链表；
- 进入链表后，会释放lock,从这里可以看出lock和condition使用不同的node;
- await()方法调用以后，调用LockSupport.unpark方法终止阻塞，利用；
- await()所有的线程都会进入队列中，循环阻塞的条件大于1；
- await()-->加入到awaiter队列---》释放锁--》判断是否为1，大于1阻塞（LockSupport.park），否则---》重新获取锁---》删除掉取消线程；
- signal()方法移除头节点；

## ReentrantLock 继承Lock

- 重入实现的原理
  - lock()---》acquire(1)---》tryAcquire---》
  - 第一次获取锁时，设置排他线程，第N次进入时，将一直递增,最大值为整数的最大值；（同一个锁被多个方法使用，可以保证同一个线程中，不同方法间的调用）
  - lock.unlock时候，会减去1，直到减为0时，则设置线程为NULL;
- lock实现的原理
  - lock锁实现，利用设置线程与当前持有的线程做比较来实现唯一性；
  - lock锁实现过程中，获取不到锁，则会进入到双向链表队列（尾部进头部出）中----》进入后，会实现自旋--》当为第一个节点并且能获取到锁时，则会执行出队过程；
  - lock锁实现数据结构是双向链表，头节点是新增的节点，该节点和Condition的链表没有关系；
  - lock链表和condition实现的数据结构是一样的，仅此一点；
  - lock锁自旋时，shouldParkAfterFailedAcquire-->parkAndCheckInterrupt：
                  首先设置node节点为singal状态，然后设置线程为LockSupport.park,（线程会阻塞在这里，等待其他线程调用LockSupport.unpark）
                  最后判断线程是否中断,若是中断，则清除中断；
  - 清除中断的目的：
               执行线程节点的出队操作，然后再执行中断；<br/>
               目的是确保线程执行中断，最终死亡；<br/>
               如果在队列中，即使中断掉，也仅仅是设置中断状态变量，jvm虚拟机会判断是否执行相应的操作来确保安全退出

- unlock实现的原理
             a、unlock--->release--->tryRelease--->unparkSuccessor
                   tryRelease 会变更 state值，移除线程;
                   unparkSuccessor 传入头节点，唤醒第一个Thread,即（2）.f；
- lockInterruptibly实现的原理
  - 获取锁跟lock方法相同，不同点在于该方法会抛出线程中断，需要应用程序处理中断异常；
  - 标准的中断异常处理方案：
              if (Thread.interrupted())    throw new InterruptedException();

- trylock()实现原理
  - 判断是否获取到锁，并不会发生阻塞；
  - 有方法可以实现中断相应；

- condition 和 ReentrantLock 实现的共同点：
  - 使用相同的数据结构：node节点，均使用waitStatus字段；
  - 不同点在于：condition 使用nextWaiter实现单向队列，ReentrantLock 使用prev和next实现双向队列；

- Sync--->AbstractQueuedSynchronizer--->AbstractOwnableSynchronizer (Node类的实现)
  - Node节点的状态
     - SIGNAL（-1）：该节点线程的后继线程会处于block，该节点cancel或者release时，需要唤醒后继节点
     - CANCELLED(1)：因为超时或中断，该线程已经被取消，
     - CONDITION(-2)：表明该线程被处于条件队列，因为调用Condition.await而被阻塞
     - PROPAGATE(-3)：传播共享锁
   - Node节点的模式: 共享模式（shared）和 独占模式（Exclusive）

- NonfairSync、FairSync--->Sync
  - NonfairSync 首先判断当前有线程获取到锁，如果没有获取到，则直接设置为当前线程；
  - FairSync 会判断队列里面是否有线程；
## ReadWriteLock读写锁

  - readLock()接口
  - writeLock()接口

## ReentrantReadWriteLock可重入读写锁

  - 内部类：ReadLock() 和 WriteLock 均实现Lock接口；
  - writeLock()锁和ReadLock()锁数量的上限为：65535,
    - 使用整型来处理无符号的短整型，其中高16位表示读锁的数量，低16位表示写锁的数量；
    - 读状态：无符号右移16位：state >>> 16
    - 写状态：高16位都和0按位与运算，抹去高16位：state & Ox0000FFFF
    - 读状态加1：state + (1 << 16)
    - 写状态加1：state + 1
    - 判断写状态大于0，也就是写锁是已经获取： state & Ox0000FFFF > 0
    - 判断读状态大于0，也就是读锁是已经获取：state != 0 && (state & Ox0000FFFF == 0)