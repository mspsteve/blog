---
sidebarDepth: 0
---

# java IO

[[toc]]

## IO字符集和字符集编码的关系

- 字符集编码是规则，字符集是按照规则下的全集；
- java默认的字符集编码是操作系统的；
- web页面的页面集编码：meta 中指定，跳转时会根据浏览器的优化准备，对输入是否编码优化；浏览器中地址栏输入取决于浏览器的字符集；

## Decoder系列

>主要解决字节和字符的转化问题
### StreamDecoder

- InputStream到Reader的过程要指定编码字符集，否则将采用操作系统默认字符集，可能会出现乱码问题；
- StreamDecoder 为字节到字符的转化器；
- StreamDecoder 会判断charset是否为JVM支持的字符集，否则会抛异常；

### StringDecoder将字节转为String类型（字符）

## Decoder和Serializable的区别

- Decoder 主要用来解决编码问题；
- Serializable序列化协议则主要解决哪些数据是用Decoder；

## Reader InputStream系列解析

### Reader 主要解决字符流读取问题

- BufferedReader 中使用char[]数据缓存数据，减少一次读取较大量数据频繁的System.arraycopy。
- PushbackReader unreader方法推回一个字符数组，将其复制到推回缓冲区前面。

### InputStream主要解决字节流的读取

- InputStream 主要解决字符流的读取，将读取的数据转化为字符。
- ByteArrayInputStream和StringBufferInputStream 读取内存数据

### InputStreamReader的作用

- 实现字节流->字符流
- 实现原理：
  - 使用InputStream构造StreamDecoder；
  - 使用StreamDecoder的字符集编码格式，将字节转为字符流；
## Writer OutputStream

- Writer 主要实现字符的写入问题；
- OutputStream 主要实现字节的写入功能：PrintWriter
- OutputStreamWriter的作用:实现字符流->字节流
- OutputStreamWriter的作用:
  - 使用OutputStream构造StreamEncoder;
  - 使用StreamDecoder的字符集编码格式，将字符转化字节流
- flush方法：如果一直调用write()，没有调用flush方法，则一直会写在内存中，且在满足默认大小时，会调用System.arrayCopy()方法发生数组复制功能；

## 字节流和字符流的设计模式
- 采用的设计模式为装饰者模式
- 装饰模式的核心思想是：不断地给流添加新的功能，将对象不断地new 放进去

```java
/**
 * bufr.reader实现缓存功能--->InputStreamReader.reader字节流向字符流转换
 * --->调用FileInputStream.reader实现字节的读取
 */
BufferedReader bufr = new BufferedReader(
                         new InputStreamReader(new FileInputStream("D:\\demo.txt"))
                     );//读取文件的字节流--->字节流转化为字符流--->创建字符流缓冲区
BufferedWriter bufw = new BufferedWriter(new OutputStreamWriter(System.out));
```
## File类
- File类是对文件系统中文件以及文件夹进行封装的对象，可以通过对象的思想来操作文件和文件夹。
- File类保存文件或目录的各种元数据信息
>文件名、文件长度、最后修改时间、是否可读、获取当前文件的路径名，判断指定文件是否存在、获得当前目录中的文件列表，创建、删除文件和目录等方法。


