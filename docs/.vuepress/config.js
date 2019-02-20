module.exports = {
    title: '陌上花开博客',
    description: '每天进步一点点',
    markdown: {
        lineNumbers: true
    },
    themeConfig: {
        lastUpdated: 'Last Updated',
        sidebarDepth: 2,
        nav: [
            { text: 'Home', link: '/' },
            { text: 'java',
              items: [
                    { text: '基础', link: '/java/base/' },
                    { text: '进阶', link: '/java/api/' },
                    { text: 'java8', link: '/java/java8/' },
                    { text: '常用工具', link: '/jvm/tools/' },
                    { text: '原理', link: '/jvm/theory/' }
                ]
            },
            { text: '网络',
                items: [
                    { text: '概念', link: '/net/base/' },
                    { text: 'RPC框架', link: '/net/rpc/' }
                ]
            },
            { text: '存储',
                items: [
                    { text: 'redis', link: '/store/redis/' },
                    { text: 'mysql', link: '/store/mysql/' }
                ]
            },
            { text: '人工智能',
                items: [
                    { text: '集体智慧编程', link: '/ai/集体智慧编程/' }
                ]
            },
            { text: '常用命令&日常',
                items: [
                    { text: '常用命令', link: '/tools/' },
                    { text: '日常', link: '/date/' },
                    { text: '读书笔记', link: '/log/' },
                ]
            },
            { text: '面试准备',
                items: [
                    { text: '老婆专用', link: '/interview/wife/' },
                    { text: '其他', link: '/interview/' }
                ]
            },
            { text: 'github', link: 'https://github.com/mspsteve/' }

        ],
        sidebar: {

            '/java/api/': [
                {
                    title: '源码解析',
                    collapsable: true,
                    children: [
                        'Unsafe/',
                        'Thread/',
                        'Executor/',
                        'Lock/'
                    ]
                }
            ],
            '/java/base/': [
                {
                  title: '基础',
                  collapsable: true,
                  children: [
                      'IO/',
                      'Reference/',
                      'Exception/',
                      '多态/',
                      '泛型/'
                  ]
                }
            ],
            //java 8相关新功能
            '/java/java8/': [
                {
                    title: 'java8新特性',
                    collapsable: true,
                    children: [
                        '',
                        'function/',
                        'guava/'
                    ]
                }
            ],
            '/jvm/tools/': [
                {
                    title: 'jvm工具',
                    collapsable: true,
                    children: [
                        '目录',
                        'jvm常用命令'
                    ]
                }
            ],

            '/jvm/theory/': [
                {
                    title: 'jvm运行原理',
                    collapsable: true,
                    children: [
                        '',
                        'java运行原理',
                        'java基本类型',
                        'jvm加载原理',
                        'jvm方法调用原理',
                        'jvm异常处理',
                        'jvm反射原理',
                        'jvm方法句柄',
                        'java内存模型',
                        'java垃圾回收',
                        'jvm锁机制'
                    ]
                }
            ],
            '/store/redis/':[
                {
                    title: 'redis',
                    collapsable: true,
                    children: [
                        '',
                        'cache缓存一致性'
                    ]
                }
            ],
            '/net/base/': [
                {
                    title: '网络与协议',
                    collapsable: true,
                    children: [
                        '',
                        'http/'
                    ]
                }
            ],
            '/ai/集体智慧编程/': [
                {
                    title: '集体智慧编程读书笔记',
                    collapsable: true,
                    children: [
                        '',
                        '提供推荐'
                    ]
                }
            ],
            '/tools/': [
                {
                    title: '常用命令',
                    collapsable: true,
                    children: [
                        '',
                        'hadoop/',
                        'hive/',
                        'linux/',
                        'ant/',
                        'markdown/'
                    ]
                }
            ],
            '/date/': [
                {
                    title: '日常积累',
                    collapsable: true,
                    children: [
                        '',
                        'unSolve/',
                        '20181023/'
                    ]
                }
            ],

            // 读书笔记
            '/log/': [
                {
                    title: '读书笔记',
                    collapsable: true,
                    children: [
                        '',
                        'secKill/'
                    ]
                }
            ],

            '/interview/wife/': [
                {
                    title: '面试准备-wife',
                    collapsable: true,
                    children: [
                        ''
                    ]
                }
            ]

        }
    }
}

