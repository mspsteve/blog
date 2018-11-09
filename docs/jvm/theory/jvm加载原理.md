---
sidebarDepth: 0
---

# jvm 加载原理

[[toc]]

## java基本数据类型

java提供8种基本的数据类型用于基础的运算，具体如下：

类型         | 值域        | 默认值       |虚拟机内部符号
---         |     ---     |      ---   |  ---
boolean     | {false,true}| false      | Z
byte        | [-128,127]  | 0          | B
short       | [-32768,32767]|0         | S
char        | [0,65535]    | '\u0000'  | C
int         | [-2^32,2^32-1]| 0        | I
long        | [-2^63,2^63-1]| 0L       | J
float       | ~[-3.4E38,3.4E38]| +0.0F | F
double      | ~[-1.8E308,1.8E308]|+0.0D| D

:::tip
浮点型数据采用IEEE754浮点数，float型0有两个值，为+0.0F和-0.0F两个值。<br>
boolean和char是唯二的无符号类型。<br>
:::

## 基本数据类型的大小

### java虚拟机栈(局部变量区)

- 32位HotSpot：boolean、byte、short、char、int、float使用4个字节，double、long使用8个字节
- 64位HotSpot：boolean、byte、short、char、int、float使用8个字节，double、long使用16个字节

### 堆字段或者数组
- boolean、byte占用1字节，char、short两字节
- 其他类型跟跟值域的大小相关


### 加载

&emsp;&emsp;java虚拟机的算数运算几乎全部依赖于操作数栈。我们需要将堆中的boolean、byte、char以及short加载到操作数栈上，而后将栈上的值当成int类型来运算。

&emsp;&emsp; boolean、char这两个无符号类型加载时伴随着零扩展。char的大小是两个字节,加载时char的值会被复制到int类型的低二字节，而高二字节则会用0来填充。

&emsp;&emsp; byte、short加载时伴随着符号扩展。举个例子，short的大小是两个字节。在加载时short的值同样会被复制到int类型的低二字节。
如果该short值为非负数，即最高位为0，那么该int类型的值的高二字节会用0来填充，否则会用1来填充。