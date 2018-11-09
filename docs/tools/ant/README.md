---
sidebarDepth: 0
---

# ant命令

[[toc]]

## 简单介绍

ant是一个将软件编译、测试、部署等步骤联系在一起加以自动化的一个工具，大多用于Java环境中的软件开发。
ant可以在项目中找到build.xml直接运行，还可以在命令行切换到构建文件目录运行。

## 常用命令

命令                    |   作用
---                    |   ---
Ant  -h                |   提供Ant命令参数任务
Ant -projecthelp \| -p |   显示当前build.xml的主要任务
Ant -version           |   显示当前Ant的最新的版本
Ant -diagnostics       |   诊断当前Ant的所有的配置
Ant -debug \| -d       |   检索当前构建文件配置情况
Ant -quiet \| -q       |   显示当前构建文件无依赖任务
Ant -emacs \| -e       |   调用编辑当前构建文件编辑器
Ant -lib [path]        |   调用当前项目中jar，class文件
Ant -logfile \|-l      |   调用运行当前项目中*.log文件
Ant -buildfile \|-f \|-file | 调用运行类似build.xml的文件
Ant -propertyfile [name] | 调用运行指定的属性文件
Ant -find \| -s file   |   检索运行指定的构建文件
Ant -autoproxy         |   使用系统自动代理构建文件
Ant-main class         |   设置系统类库文件中主要类
Ant -nice number       |   设置主类线程允许的线程数

## mac环境安装

- 下载ant [链接](http://ant.apache.org/)
- 解压安装包, 例如如解压后的目录：/Users/alex/tool/apache-ant-1.9.7
- 在/Users/alex/tool/apache-ant-1.9.7下创建文件.profile
```shell
export ANT_HOME=/Users/alex/tool/apache-ant-1.9.7

export PATH=${ANT_HOME}/bin:$PATH
```
- 执行 source ~/.bash_profile 让配置生效

