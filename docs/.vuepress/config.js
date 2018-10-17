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
                    { text: 'base', link: '/java/base/' },
                    { text: 'use', link: '/java/use/' },
                    { text: 'api', link: '/java/api/' }
                ]
            },
            { text: '常用命令&日常',
                items: [
                    { text: '常用命令', link: '/tools/' },
                    { text: '日常', link: '/date/' }
                ]
            },
            { text: 'github', link: 'https://github.com/mspsteve/' }

        ],
        sidebar: {

            '/java/base/': [
                {
                  title: 'java基础',
                  collapsable: true,
                  children: [
                      '',
                      '多态/',
                      '泛型/'
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
                        'markdown/'
                    ]
                }
            ]
        }
    }
}

