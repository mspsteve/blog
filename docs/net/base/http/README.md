---
sidebarDepth: 0
---

# http 基础概念

[[toc]]

## MIME类型
         a、HTML 格式的文本文档由 text/html 类型来标记。
         b、普通的 ASCII 文本文档由 text/plain 类型来标记。
  c、 JPEG 版本的图片为 image/jpeg 类型。
  d、 GIF 格式的图片为 image/gif 类型。
  e、 Apple 的 QuickTime 电影为 video/quicktime 类型。
  f、微软的 PowerPoint 演示文件为 application/vnd.ms-powerpoint 类型。
（2）URI 和URL
（3）HTTP事务：发起请求，获取相应结果
        a、方法
        b、状态码
        c、传输对象
（4）载体：HTTP报文
         a、起始行：表名需要做什么事情
         b、首部行
         c、报文正文


HTTP（HyperTextTransferProtocol）是超文本传输协议的缩写，它用于传送WWW方式的数据，关于HTTP协议的详细内容请参考RFC2616。HTTP协议采用了请求/响应模型。客户端向服务器发送一个请求，请求头包含请求的方法、URI、协议版本、以及包含请求修饰符、客户信息和内容的类似于MIME的消息结构。服务器以一个状态行作为响应，相应的内容包括消息协议的版本，成功或者错误编码加上包含服务器信息、实体元信息以及可能的实体内容。

通常HTTP消息包括客户机向服务器的请求消息和服务器向客户机的响应消息。
这两种类型的消息由一个起始行，一个或者多个头域，一个只是头域结束的空行和可选的消息体组成。
（1）HTTP的头域包括通用头，请求头，响应头和实体头四个部分。每个头域由一个域名，冒号（:）和域值三部分组成。域名是大小写无关的，域值前可以添加任何数量的空格符，头域可以被扩展为多行，在每行开始处，使用至少一个空格或制表符。

     通用头域
     a、Cache-Control头域
        Cache-Control指定请求和响应遵循的缓存机制。在请求消息或响应消息中设置Cache-Control并不会修改另一个消息处理过程中的缓存处理过程。请求时的缓存指令包括no- cache、no-store、max-age、max-stale、min-fresh、only-if-cached，响应消息中的指令包括 public、private、no-cache、no-store、no-transform、must-revalidate、proxy- revalidate、max-age。各个消息中的指令含义如下：
Public指示响应可被任何缓存区缓存。
Private指示对于单个用户的整个或部分响应消息，不能被共享缓存处理。这允许服务器仅仅描述当用户的部分响应消息，此响应消息对于其他用户的请求无效。
no-cache指示请求或响应消息不能缓存
no-store用于防止重要的信息被无意的发布。在请求消息中发送将使得请求和响应消息都不使用缓存。
max-age指示客户机可以接收生存期不大于指定时间（以秒为单位）的响应。
min-fresh指示客户机可以接收响应时间小于当前时间加上指定时间的响应。
max-stale指示客户机可以接收超出超时期间的响应消息。如果指定max-stale消息的值，那么客户机可以接收超出超时期指定值之内的响应消息。
   b、Date头域
       Date头域表示消息发送的时间，时间的描述格式由rfc822定义。例如，Date:Mon,31Dec200104:25:57GMT。Date描述的时间表示世界标准时，换算成本地时间，需要知道用户所在的时区。
   c、Pragma头域
       用来包含实现特定的指令，最常用的是Pragma:no-cache。在HTTP/1.1协议中，它的含义和Cache-Control:no-cache相同。

   消息头域
   d、Host头域
        指定请求资源的Intenet主机和端口号，必须表示请求url的原始服务器或网关的位置。HTTP/1.1请求必须包含主机头域，否则系统会以400状态码返回。
   e、Referer头域
       允许客户端指定请求uri的源资源地址，这可以允许服务器生成回退链表，可用来登陆、优化cache等。他也允许废除的或错误的连接由于维护的目的被追踪。如果请求的uri没有自己的uri地址，Referer不能被发送。如果指定的是部分uri地址，则此地址应该是一个相对地址。
  f、Range头域
      求实体的一个或者多个子范围。
  g、User-Agent头域
       包含发出请求的用户信息

响应消息
  h、HTTP- Version
        表示支持的HTTP版本，例如为HTTP/1.1
  i、Status-Code
     1xx:信息响应类，表示接收到请求并且继续处理
     2xx:处理成功响应类，表示动作被成功接收、理解和接受
      3xx:重定向响应类，为了完成指定的动作，必须接受进一步处理
     4xx:客户端错误，客户请求包含语法错误或者是不能正确执行
     5xx:服务端错误，服务器不能正确执行一个正确的请求
 j、包含Age、 Location、Proxy-Authenticate、Public、Retry-After、Server、Vary、Warning、WWW- Authenticate。
     对响应头域的扩展要求通讯双方都支持，如果存在不支持的响应头域，一般将会作为实体头域处理

实体
k、实体头域
     包括Allow、Content- Base、Content-Encoding、Content-Language、Content-Length、Content-Location、 Content-MD5、Content-Range、Content-Type、Etag、Expires、Last-Modified、 extension-header。extension-header允许客户端定义新的实体头，但是这些域可能无法未接受方识别。

1）Content-Type实体头
     用于向接收方指示实体的介质类型，指定HEAD方法送到接收方的实体介质类型，或GET方法发送的请求介质类型Content-Range实体头
2）Content-Range实体头
    用于指定整个实体中的一部分的插入位置，他也指示了整个实体的长度。在服务器向客户返回一个部分响应，它必须描述响应覆盖的范围和整个实体长度。一般格式：Content-Range:bytes-unitSPfirst-byte-pos-last-byte-pos/entity-legth
3）Last-modified实体头
    Last-modified实体头指定服务器上保存内容的最后修订时间。
l、实体
   可以是一个经过编码的字节流，它的编码方式由Content-Encoding或Content-Type定义，它的长度由Content-Length或 Content-Range定义。