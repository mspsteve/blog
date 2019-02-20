---
sidebarDepth: 0
---

# guava

[[toc]]

## 集合
- 不可变集合(线程安全、中途不可改变、效率高)

```java
ImmutableList<String> iList = ImmutableList.of("a", "b", "c");
ImmutableSet<String> iSet = ImmutableSet.of("e1", "e2");
ImmutableMap<String, String> iMap = ImmutableMap.of("k1", "v1", "k2", "v2");
```
- 其他复杂数据结构

```java
//嵌套数据类型
Multimap<String,Integer> map = ArrayListMultimap.create();
map.put("aa", 1);
map.put("aa", 2);

//无序+可重复 count()方法获取单词的次数  增强了可读性+操作简单
Multiset<String> set = HashMultiset.create();

//key-value  key可以重复
Multimap<String, String> teachers = ArrayListMultimap.create();

//BiMap: 双向Map(Bidirectional Map) 键与值都不能重复
BiMap<String, String> biMap = HashBiMap.create();

//双键的Map Map--> Table-->rowKey+columnKey+value
Table<String, String, Integer> tables = HashBasedTable.create();

```

- 集合与字符串转化

```java
//list 转化为 String
ImmutableList<String> iList = ImmutableList.of("a", "b", "c");
String result = Joiner.on("-").join(list);

//把map集合转换为特定规则的字符串
ImmutableMap<String, String> iMap = ImmutableMap.of("k1", "v1", "k2", "v2");
String result = Joiner.on(",").withKeyValueSeparator("=").join(map);

//字符串转化为list
String str = "1-2-3-4-5-6";
List<String> list = Splitter.on("-").splitToList(str);

String str="1-2-3-4- 5-  6  ";
List<String> list = Splitter.on("-").omitEmptyStrings().trimResults().splitToList(str);

//String转换为map
String str = "xiaoming=11,xiaohong=23";
Map<String,String> map = Splitter.on(",").withKeyValueSeparator("=").split(str);

// 支持多个字符串切割转map,可支持正则表达式
String input = "aa.dd,,ff,,.";
List<String> result = Splitter.onPattern("[.|,]").omitEmptyStrings().splitToList(input);
```

- 集合的过滤

```java
ImmutableList<String> names = ImmutableList.of("begin", "code", "Guava", "Java");
Iterable<String> fitered = Iterables.filter(names, Predicates.or(Predicates.equalTo("Guava"), Predicates.equalTo("Java")));

//自定义过滤条件   使用自定义回调方法对Map的每个Value进行操作
ImmutableMap<String, Integer> m = ImmutableMap.of("begin", 12, "code", 15);
        // Function<F, T> F表示apply()方法input的类型，T表示apply()方法返回类型
        Map<String, Integer> m2 = Maps.transformValues(m, new Function<Integer, Integer>() {
            public Integer apply(Integer input) {
            return input > 12 ? input : input + 1;
        });
//set、map交集、并集、差集
SetView union = Sets.union(setA, setB);
SetView difference = Sets.difference(setA, setB);
SetView intersection = Sets.intersection(setA, setB);

MapDifference differenceMap = Maps.difference(mapA, mapB);
differenceMap.areEqual();
Map entriesDiffering = differenceMap.entriesDiffering();
Map entriesOnlyOnLeft = differenceMap.entriesOnlyOnLeft();
Map entriesOnlyOnRight = differenceMap.entriesOnlyOnRight();
Map entriesInCommon = differenceMap.entriesInCommon();
```

- 使用方式：

```java
    User user = new User("zm");
    Consumer<User> userConsumer = User1 -> User1.setName("zmChange");//接受一个参数
    userConsumer.accept(user);
```
-  其他类型：BiConsumer、DoubleConsumer、IntConsumer、LongConsumer、ObjDoubleConsumer

## 缓存
- CacheLoader

```java
LoadingCache<String,String> cahceBuilder=CacheBuilder
		        .newBuilder()
		        .build(new CacheLoader<String, String>(){
		            @Override
		            public String load(String key) throws Exception {
		                String strProValue="hello "+key+"!";
		                return strProValue;
		            }
		        });
System.out.println(cahceBuilder.apply("begincode"));  //hello begincode!
System.out.println(cahceBuilder.get("begincode")); //hello begincode!
System.out.println(cahceBuilder.get("wen")); //hello wen!
System.out.println(cahceBuilder.apply("wen")); //hello wen!
System.out.println(cahceBuilder.apply("da"));//hello da!
cahceBuilder.put("begin", "code");
System.out.println(cahceBuilder.get("begin")); //code
```

- callback

```java
 Cache<String, String> cache = CacheBuilder.newBuilder().maximumSize(1000).build();
	        String resultVal = cache.get("code", new Callable<String>() {
	            public String call() {
	                String strProValue="begin "+"code"+"!";
	                return strProValue;
	            }
	        });
 System.out.println("value : " + resultVal); //value : begin code!
```

## 原生类型支持



## 并发库



## 通用注解


## 字符串处理

- 字符串基本操作(Strings)

```java
//null，empty的处理(nullToEmpty、emptyToNull、isNullOrEmpty)
String s = "maoshiping";
Boolean r = Strings.isNullOrEmpty(s); //判断是否为空

// 字符串前|后append提供的字符，以达到指定长度
略

//repeat：将给定字符串重复给定次数后返回新串
略

//判断是否有相同前缀，相同后缀(commonPrefix | commonSuffix)
略

```

- 字符串链接操作(Joiner)

```java
String str = Joiner.on(",").skipNulls().join(strList);
```

- 字符串分割操作(Splitter)

```java
String str = "1,2,   3  ,,4,";
//trimResults():去除空格，omitEmptyStrings()：删除空数组
List<String> strList = Splitter.on(",")
                               .trimResults()
                               .omitEmptyStrings()
                               .splitToList(str);
```

- 字符串变换

```java
//字符串替换
String str = "abcdef";
String newStr = str.replace("bcde","hello");

String str2 = "ABC    abc    123";
//获取数字、大小写字母、所有字母(具体参见CharMatcher枚举值)
String digit = CharMatcher.JAVA_DIGIT.retainFrom(str2); //数字

//将多余的空格替换成一个空格
String s = CharMatcher.whitespace().trimAndCollapseFrom(str2,' ');

```

## IO操作

- 复制、移动、删除操作

```java
private final String TARGET_FILE = "path";
File sourceFile = new File(SOURCE_FILE);
Files.copy(sourceFile, new File(TARGET_FILE));

Files.move(sourceFile, new File(TARGET_FILE));

sourceFile.delete();
```

- 文件的读写和文件的MD5验证

```java
File file = new File(SOURCE_FILE);
List<String> content = Files.readLines(file, Charsets.UTF_8); //按行写
String read = Files.asCharSource(file, Charsets.UTF_8).read(); //读取整个文件的内容
List<Integer> integers = Files.asCharSource(file, Charsets.UTF_8).readLines(lineProcessor); //采用处理器处理

Files.asCharSink(file,Charsets.UTF_8).write("content1"); //覆盖写
Files.asCharSink(file,Charsets.UTF_8, FileWriteMode.APPEND).write("content1"); //追加写

HashCode sourceHash = Files.hash(file, Hashing.sha256());
File targetFile = new File(TARGET_FILE);
HashCode targetHash = Files.hash(targetFile, Hashing.sha256());
HashCode hash = Files.asByteSource(file).hash(Hashing.sha256());
```

- 文件的递归

```java
FluentIterable<File> files = Files.fileTreeTraverser().preOrderTraversal(rootFile); //前序遍历
FluentIterable<File> files = Files.fileTreeTraverser().breadthFirstTraversal(rootFile); //广度优先遍历
```

