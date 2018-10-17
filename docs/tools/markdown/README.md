---
sidebarDepth: 0
---

# markdown使用

[[toc]]

## crontab命令

- crond linux循环运行的定时任务
- at命令为一次运行任务
- 文件路径：/etc/crontab
- crond表达式格式:minute   hour   day   month   week   command
- crond日志重定向 ：0 */3 * * * /usr/local/apache2/apachectl restart >/dev/null 2>&1
- crond用法

### crond用法

- crond服务

``` powershell
service crond status #查看crontab服务状态
service crond start  #手动启动crontab服务
ntsysv #查看crontab服务是否已设置为开机启动，执行命令
chkconfig –level 35 crond on #加入开机自动启动
```

- crontab命令

``` powershell
crontab -l #列出crontab文件
crontab -e #编辑crontab文件，保存后自动运行
crontab -r #删除crontab文件
crontab <filename> #恢复丢失文件
```

## awk命令

## cut命令

