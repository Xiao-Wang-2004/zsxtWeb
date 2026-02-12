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
      },
      {
        name: '原料信息',
        path: '/basic-info/number-info'
      },
      {
        name: '机台设备',
        path: '/basic-info/machine-info'
      },
      {
        name: '产品信息',
        path: '/basic-info/product-info'
      }
    ]
  },
  {
    name: '订单管理',
    icon: '/order.png',
    children: [
      {
        name: '订单生成',
        path: '/order/create'
      },
      {
        name: '订单入库',
        path: '/order/in-library'
      }
    ]
  }
];