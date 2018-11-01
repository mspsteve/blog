---
sidebarDepth: 0
---

# 引用解析

[[toc]]

## Reference的4种状态
- Active：初始创建，开始分配内存的状态；
- Pending：
  - ReferenceHandler 驻守线程变更的状态；
  - 只有注册了队列的对象(构造的时候传了队列对象参数，即ReferenceQueue<? super T> queue;)才能变更
  - 将在ReferenceQueue的enqueue 中变更为Enqueued
- Enqueued：
  - 对象的内存将要被回收，但未回收；
  - 放在队列中，方便查询；
- Inactive：终态，说明对象已经不存在。

## Reference中的构造函数
- Reference(T referent) 与Reference(T referent, ReferenceQueue<? super T> queue)区别
  - 若传值ReferenceQueue，则对象的状态经历：Active->Pending->Enqueued->Inactive
  - 不传值，则对象的状态经历：Active->Inactive
- 具体实现过程
  - ReferenceHandler 优先级最高的驻守线程，根据参数值判断是否进入队列;
  - discovered 值为Pending变更前的状态，表示对象即将要被回收；
## WeakReference的意义
- 标示对象为弱引用，当有潜在的内存泄漏分险时，将有驻守线程将其标记为可回收的对象；
- GC垃圾回收机制会根据状态，回收弱引用对象；


