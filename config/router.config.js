export default [
  // user
  {
    path: '/public/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/public/user', redirect: '/public/user/login' },
      { path: '/public/user/login', component: './User/Login' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      { path: '/', redirect: '/user/list' },
      {
        path: '/user',
        name: 'user',
        icon: 'user',
        routes: [
          {
            path: '/user/list',
            name: 'list',
            component: './User/List',
          },
          {
            path: '/user/add',
            name: 'add',
            component: './User/Edit',
            hideInMenu: true,
          },
          {
            path: '/user/edit/:id',
            name: 'edit',
            component: './User/Edit',
            hideInMenu: true,
          },
        ],
      },
      {
        path: '/order',
        name: 'order',
        icon: 'file-text',
        routes: [
          {
            path: '/order/list',
            name: 'list',
            component: './Order/List',
          },
        ],
      },
      {
        path: '/category',
        name: 'category',
        icon: 'cluster',
        routes: [
          {
            path: '/category/list',
            name: 'list',
            component: './Category/List',
          },
          {
            path: '/category/add',
            name: 'add',
            component: './Category/Edit',
            hideInMenu: true,
          },
          {
            path: '/category/edit/:parent_id/:id',
            name: 'edit',
            component: './Category/Edit',
            hideInMenu: true,
          },
        ],
      },
      {
        path: '/grade',
        name: 'grade',
        icon: 'crown',
        routes: [
          {
            path: '/grade/list',
            name: 'list',
            component: './Grade/List',
          },
          {
            path: '/grade/add',
            name: 'add',
            component: './Grade/Edit',
            hideInMenu: true,
          },
          {
            path: '/grade/edit/:id',
            name: 'edit',
            component: './Grade/Edit',
            hideInMenu: true,
          },
        ],
      },
      {
        path: '/department',
        name: 'department',
        icon: 'experiment',
        routes: [
          {
            path: '/department/list',
            name: 'list',
            component: './Department/List',
          },
          {
            path: '/department/add',
            name: 'add',
            component: './Department/Edit',
            hideInMenu: true,
          },
          {
            path: '/department/edit/:id',
            name: 'edit',
            component: './Department/Edit',
            hideInMenu: true,
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
