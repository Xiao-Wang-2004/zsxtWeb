export const menuConfig = [
  {
    name: '系统首页',
    icon: '/home.png',
    path: '/'
  },
  {
    name: '基本信息',
    icon: '/msg.png',
    children: [
      {
        name: '单位信息',
        path: '/basic-info/unit-info'
      },
      {
        name: '模具信息',
        path: '/basic-info/mold-info'
      },
      {
        name: '模具料号',
        path: '/basic-info/mold-number'
      }
    ]
  }
];