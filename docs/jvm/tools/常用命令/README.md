---
sidebarDepth: 0
---

# JVM常用命令整理

[[toc]]

## 对象数量

```powershell
jmap -histo 【pid】>jmaphisto.log
jmap -F -histo 【pid】>jmaphisto.log    #服务已死加 -F
jmap -histo:live 【pid】>jmaphisto.log  #只看存活（会触发fullgc再导出）
```


## 内存Dump

```powershell
jmap -dump:format=b,file=jmapdump.hprof 【pid】
jmap -F -dump:format=b,file=jmapdump.hprof 【pid】
tar zcvf jmapdump.hprof.tar.gz jmapdump.hprof
```

## GC情况

```powershell
jstat -gccapacity
jstat -gcutil 【pid】 1000 100 #每1000毫秒看内存情况，持续100次
```

### 指标解释：

- S0 — Heap上的 Survivor space 0 区已使用空间的百分比
- S1 — Heap上的 Survivor space 1 区已使用空间的百分比
- E — Heap上的 Eden space 区已使用空间的百分比
- O — Heap上的 Old space 区已使用空间的百分比
- P — Perm space 区已使用空间的百分比
- YGC — 从应用程序启动到采样时发生 Young GC 的次数
- YGCT– 从应用程序启动到采样时 Young GC 所用的时间(单位秒)
- FGC — 从应用程序启动到采样时发生 Full GC 的次数
- FGCT– 从应用程序启动到采样时 Full GC 所用的时间(单位秒)
- GCT — 从应用程序启动到采样时用于垃圾回收的总时间(单位秒)

## 线程堆栈

```powershell
jstack 【pid】 >jstack.log
jstack -F 【pid】 >jstack.log   #服务已死加 -F
jstack -F -m 【pid】 >jstack.log
jstack -F -m -l 【pid】 >jstack.log
```
## 线程的资源情况

```powershell
pstree 【pid】  打印进程的线程使用情况
top  看资源使用情况
top -Hp 【pid】      看进程内线程资源情况转为16进制配合jstack可查询线程cpu情况
```