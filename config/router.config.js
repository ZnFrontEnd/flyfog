export default [
    {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
            // 首页
            { path: '/', redirect: '/business/receipt' },
            {
                path: '/home',
                name: '主页',
                icon: 'home',
                hideInMenu: true,
                component: './Home',
            },
            // 企业管理
            {
                path: '/testOne',
                name: '测试页面1号',
                icon: 'bank',
                routes: [
                    {
                        path: '/testOne/Ledger',
                        name: '测试页面1号子页面',
                        component: './TestOne/Ledger',
                    },
                ],
            },
            {
                path: '/testTwo',
                name: '测试页面2号',
                icon: 'dashboard',
                routes: [
                    {
                        path: '/testTwo/receipt',
                        name: '测试页面2号子页面',
                        component: './TestTwo/Receipt',
                    },
                ],
            },
        ],
    },
]
