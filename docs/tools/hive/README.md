---
sidebarDepth: 0
---

# hive命令

[[toc]]

## 原理

- hive是在hadoop上封装SQL接口
- hadoop负责翻译成MapReduce去Hadoop上执行

## 常用命令

- shell脚本使用hive模式

```powershell
hive -e "sql"
```

- 查看所有database

```powershell
   show databases;
```

- 查看table在hdfs上的存储路径

```powershell
show create table M_BD_T_GAS_ORDER_INFO_H;
```

