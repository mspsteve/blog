---
sidebarDepth: 0
---

# 限流相关

[[toc]]

## 相关概念

  &emsp;&emsp;限流即流量限制，即流量整形，限流的目的是在遇到流量高峰期或者流量突增（流量尖刺）时，
  把流量速率限制在系统所能接受的合理范围之内，不至于让系统被高流量击垮。

## 常见方式

- 通过限制单位时间段内调用量来限流
- 通过限制系统的并发调用程度来限流
- 使用漏桶（Leaky Bucket）算法来进行限流
- 使用令牌桶（Token Bucket）算法来进行限流

## 常见的限流算法

   任何一种限流工具的使用，都是为了保证被调用方服务稳定，因此，在实际环境中务必要保证限流值是可以修改。

### 计算器法

#### 特点

  有点简单粗暴，实现思想：会根据请求进来的数量，依次累加，如果到达单位时间内的最大值时，后续的请求会被拒绝，会导致突刺现象。

#### 实现思想

  AtomicLong#incrementAndGet()方法来给计数器加1并返回最新值，通过这个最新值和阈值进行比较

#### 具体实现

```java
public class Throttling {

    private static final Logger logger = LoggerFactory.getLogger(Throttling.class);
    private static final ConcurrentMap<String, Throttling> MAP = new ConcurrentHashMap<>();

    private final AtomicInteger concurrency = new AtomicInteger();
    private final ThrottlingConfig throttlingKey;

    private Throttling(ThrottlingConfig throttlingKey) {
        this.throttlingKey = throttlingKey;
    }

    /**
     * 尝试进入一个限流方法
     * @return {@code true}表示进入成功, {@code false}表示超过限流了
     */
    public boolean tryEnter() {
        if (concurrency.incrementAndGet() > throttlingKey.getThreshold()) {
            return false;
        }
        return true;
    }

    /**
     * 离开限流方法
     * @return 离开后的并发数
     */
    public int leave() {
        return concurrency.decrementAndGet();
    }
}

```

#### 使用场景

   限流某个接口的时间窗请求数，具体实现方案如下：
   ```java
   LoadingCache<Long, AtomicLong> counter =
           CacheBuilder.newBuilder()
                   .expireAfterWrite(2, TimeUnit.SECONDS)
                   .build(new CacheLoader<Long, AtomicLong>() {
                       @Override
                       public AtomicLong load(Long seconds) throws Exception {
                           return new AtomicLong(0);
                       }
                   });
   long limit = 1000;
   while(true) {
       //得到当前秒
       long currentSeconds = System.currentTimeMillis() / 1000;
       // 大于当前值则被阻塞
       if(counter.get(currentSeconds).incrementAndGet() > limit) {
           continue; //可以根据具体要求，来选择是否需要while循环
       }
       //业务处理
   }
   ```

### 漏铜算法

#### 特点

&emsp;&emsp;为了消除"突刺现象"，可以采用漏桶算法实现限流，漏桶算法这个名字就很形象，算法内部有一个容器，类似生活用到的漏斗，当请求进来时，相当于水倒入漏斗，然后从下端小口慢慢匀速的流出。
不管上面流量多大，下面流出的速度始终保持不变。缺点：无法应对短时间的突发流量。

#### 实现

&emsp;&emsp;使用队列来保存请求，另外通过一个线程池定期从队列中获取请求并执行，可以一次性获取多个并发执行。

### 令牌桐算法

#### 特点

&emsp;&emsp;令牌桶算法是对漏桶算法的一种改进，桶算法能够限制请求调用的速率，而令牌桶算法能够在限制调用的平均速率的同时还允许一定程度的突发调用。

#### 实现思想

&emsp;&emsp;算法中存在一种机制，以一定的速率往桶中放令牌。每次请求调用需要先获取令牌，只有拿到令牌，才有机会继续执行，否则选择选择等待可用的令牌、或者直接拒绝。

#### 具体实现

&emsp;&emsp;使用谷歌开源guava工具： RateLimiter类的create方法创建限流器，具体实现方式如下：
```java
        RateLimiter rateLimiter = RateLimiter.create(10);
        rateLimiter.acquire(); // 阻塞方式，直到获取到令牌

        if(tryAcquire()) { // 非阻塞方式，拿到令牌去执行业务逻辑，否则本次请求结束，也可以指定超时时间

        }
```

::::warning
    令牌桶按照一定的速率生产令牌，并不是由请求触发计算下一次的令牌领取时间，所以在同一秒内，如果请求分布不均匀，是可以用QPS概念来衡量。
    秒的间隔是以RateLimiter.create(10)为startTime。
::::

### 工作code

&emsp;&emsp;基于注解版本的代码实现,具体如下：

```java
public class RateLimiterAspect {
    private static Map<RateLimiterEnum, DynamicRateLimiter> rateLimiterMap = new ConcurrentHashMap<>();

    @Pointcut(value = "@within(rateLimiterAcquire) || @annotation(rateLimiterAcquire)", argNames = "rateLimiterAcquire")
    public void acquire(RateLimiterAcquire rateLimiterAcquire) {
    }

   @Pointcut(value = "@within(rateLimiterTryAcquire) || @annotation(rateLimiterTryAcquire)", argNames = "rateLimiterTryAcquire")
    public void tryAcquire(RateLimiterTryAcquire rateLimiterTryAcquire) {
    }

    @Around("acquire(rateLimiterAcquire)")
    public Object doSurroundAcquire(ProceedingJoinPoint pjp, RateLimiterAcquire rateLimiterAcquire) throws Throwable {
        MethodSignature methodSignature = (MethodSignature) pjp.getSignature();
        RateLimiterEnum configKey = rateLimiterAcquire.value();
        DynamicRateLimiter dynamicRateLimiter = rateLimiterMap.computeIfAbsent(configKey,
                key -> DynamicSuppliers.dynamicRateLimiter(key.getValue()::get));

        dynamicRateLimiter.acquire(1);
        return pjp.proceed();
    }

    @Around("tryAcquire(rateLimiterTryAcquire)")
    public Object doSurroundTryAcquire(ProceedingJoinPoint pjp, RateLimiterTryAcquire rateLimiterTryAcquire) throws Throwable {

        MethodSignature methodSignature = (MethodSignature) pjp.getSignature();

        RateLimiterEnum configKey = rateLimiterTryAcquire.value();
        DynamicRateLimiter dynamicRateLimiter = rateLimiterMap.computeIfAbsent(configKey,
                key -> DynamicSuppliers.dynamicRateLimiter(key.getValue()::get));

        if (dynamicRateLimiter.tryAcquire(1)) {
            return pjp.proceed();
        } else {
            PerfBuilder perfBuilder = PerfUtils.perf(RedPacketPerfConstants.TAG, "rateLimiter",
                    methodSignature.getMethod().getName());
            perfBuilder.logstash();
            return null;
        }
    }

}

// 工厂类
public class DynamicSuppliers {

    private DynamicSuppliers() {
        throw new UnsupportedOperationException();
    }

    public static <K, V> Supplier<V> dynamicSupplier(Supplier<K> supplier, BiFunction<K, V, V> remapping) {
        return new DynamicSupplier<>(supplier, remapping);
    }

    public static DynamicRateLimiter dynamicRateLimiter(Supplier<Number> numberSupplier) {
        return new DynamicRateLimiter(dynamicSupplier(numberSupplier, (key, oldValue) -> {
            if (oldValue == null) {
                return RateLimiter.create(key.doubleValue());
            } else {
                oldValue.setRate(key.doubleValue());
                return oldValue;
            }
        }));
    }
}

其他略
```

## 分布式限流

&emsp;&emsp;具体参考开涛大神 [限流](https://jinnianshilongnian.iteye.com/blog/2305117)
其中，有关nginx相关的限流方案会在nginx 学习中给出。

## 应用级别限流

&emsp;&emsp;基于Tomcat的Connector的相关配置来实现限流：

- acceptCount：如果Tomcat的线程都忙于响应，新来的连接会进入队列排队，如果超出排队大小，则拒绝连接；
- maxConnections： 瞬时最大连接数，超出的会排队等待；
- maxThreads：Tomcat能启动用来处理请求的最大线程数，如果请求处理量一直远远大于最大线程数则可能会僵死。

## 参考文档

- [限流-开涛](https://jinnianshilongnian.iteye.com/blog/2305117)
- [限流-简书](https://www.jianshu.com/p/2596e559db5c)




























