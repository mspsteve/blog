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
                    { text: 'java', link: '/java/' },
                    { text: '原理', link: '/jvm/theory/' }
                ]
            },
            { text: '中间件',
                items: [
                    { text: 'rpc', link: '/rpc/' },
                    { text: 'mysql', link: '/mysql/' },
                    { text: 'redis', link: '/redis/' },
                    { text: 'message', link: '/message/' },
                    { text: 'nginx', link: '/nginx/' }
                ]
            },
            { text: 'AI',
                items: [
                    { text: '集体智慧编程', link: '/ai/reco/' }
                ]
            },
            { text: '日常积累',
                items: [
                    { text: '命令', link: '/tools/' },
                    { text: '日常', link: '/date/' },
                ]
            },
            { text: 'other',
                items: [
                    { text: '其他', link: '/other/' }
                ]
            },
            { text: '面试',
                items: [
                    { text: '面试', link: '/interview/' }
                ]
            },
            { text: 'github', link: 'https://github.com/mspsteve/' }

        ],
        sidebar: {
            '/java/': [
                {
                    title: '源码解析',
                    collapsable: true,
                    children: [
                        '',
                        '1.1-Exception/',
                        '1.2-IO/',
                        '1.3-Reference/',
                        '1.4-Thread/',
                        '1.5-Executor/',
                        '1.6-Lock/',
                        '1.7-Unsafe/',
                        '2.1-function/',
                        '2.2-guava/'
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
            '/rpc/':[
                {
                    title: 'rpc',
                    collapsable: true,
                    children: [
                        ''
                    ]
                }
            ],
            '/mysql/':[
                {
                    title: 'mysql',
                    collapsable: true,
                    children: [
                        ''
                    ]
                }
            ],
            '/redis/':[
                {
                    title: 'redis',
                    collapsable: true,
                    children: [
                        '',
                        'cache缓存一致性'
                    ]
                }
            ],
            '/message/':[
                {
                    title: 'message',
                    collapsable: true,
                    children: [
                        ''
                    ]
                }
            ],
            '/nginx/':[
                {
                    title: 'redis',
                    collapsable: true,
                    children: [
                        ''
                    ]
                }
            ],

            '/ai/reco/': [
                {
                    title: '集体智慧编程',
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
                        'markdown/',
                        'java/'
                    ]
                }
            ],
            '/date/': [
                {
                    title: '日常积累',
                    collapsable: true,
                    children: [
                        '',
                        '20181023/',
                        '20190220/',
                        'seckill/',
                        'rateLimit/'
                    ]
                }
            ],
        '/other/': [
            {
                title: '杂记',
                collapsable: true,
                children: [
                    ''
                ]
            }
        ],
        '/interview/': [
                {
                    title: '面试',
                    collapsable: true,
                    children: [
                        ''
                    ]
                }
            ]

        }
    }
}

