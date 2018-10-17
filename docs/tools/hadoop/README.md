---
sidebarDepth: 0
---

# hadoop命令

[[toc]]

## 调用方法

`hadoop-client`的命令的使用，都是用{Hadoop_HOME}/bin/hadoop脚本来调用的。

## 常用命令

- 查看文件或目录的属性

```powershell
hadoop fs -ls viewfs://xxx(路径)
```

- 删除一个文件

```powershell
hadoop fs -rm viewfs://xxx(路径)
```

- 将HDFS文件夹内的合并到保存到本地

```powershell
hadoop fs -getmerge -nl /src /opt/output.txt #将/src目录中的文件合并，然后写入到/opt/output.txt文件中。
```

- 获取HDFS文件

```powershell
hadoop fs -get /src /opt/output.txt #将/src目录中的文件合并，然后写入到/opt/output.txt文件中。
```