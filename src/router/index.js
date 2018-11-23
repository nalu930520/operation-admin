import Layout from '../views/layout/Layout'
import Vue from 'vue'
import Router from 'vue-router'
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  {
    path: '/',
    redirect: '/dashboard/index'
  },
  {
    path: '/dashboard',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '概览',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '概览', icon: 'dashboard' }
      }
    ]
  },
  // 组件表格
  { path: '/tableIndex', component: () => import('@/components/TableCom') },
  { path: '/crowdFormGroupIndex', component: () => import('@/components/CrowdFormGroup') }
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/admanagement',
    name: '投放管理',
    component: Layout,
    redirect: '/admanagement/eventAdvertising',
    meta: { title: '投放管理', icon: 'example', roles: ['admin', 'editor'] },
    children: [
      {
        path: 'eventAdvertising',
        name: 'eventAdvertising',
        component: () => import('@/views/eventAdvertising'),
        meta: { title: '活动广告', icon: 'table', roles: ['admin', 'editor'] }
      },
      {
        path: 'notification',
        name: 'notification',
        component: () => import('@/views/notification'),
        meta: { title: '推送通知', icon: 'table', roles: ['admin', 'editor'] }
      },
      {
        path: 'add-notification',
        name: 'add-notification',
        component: () => import('@/views/notification/addNotification'),
        meta: { title: '添加推送', icon: 'table', roles: ['admin', 'editor'] },
        hidden: true
      },
      {
        path: 'add-notification/:id',
        name: 'edit-notification',
        component: () => import('@/views/notification/addNotification'),
        meta: { title: '编辑推送', icon: 'table', roles: ['admin', 'editor'] },
        hidden: true
      },
      {
        path: 'push-recycle',
        name: 'push-recycle',
        component: () => import('@/views/notification/pushRecycle'),
        meta: { title: '回收站', icon: 'table', roles: ['admin', 'editor'] },
        hidden: true
      },
      {
        path: 'advertisinglist/:id',
        name: 'advertisinglist',
        component: () => import('@/views/eventAdvertising/advertisinglist'),
        meta: { title: '广告列表', icon: 'table', roles: ['admin', 'editor'] },
        hidden: true
      },
      {
        path: 'Editname/:id',
        name: 'Editname',
        component: () => import('@/views/eventAdvertising/Editname'),
        meta: { title: '修改活动名称', icon: 'table', roles: ['admin', 'editor'] },
        hidden: true
      },
      {
        path: 'Addads',
        name: 'Addads',
        component: () => import('@/views/eventAdvertising/Addads'),
        meta: { title: '添加广告', icon: 'tree', roles: ['admin', 'editor'] },
        hidden: true
      },
      {
        path: 'Addads/:id',
        name: 'edit',
        component: () => import('@/views/eventAdvertising/Addads'),
        meta: { title: '编辑广告', icon: 'tree', roles: ['admin', 'editor'] },
        hidden: true
      },
      {
        path: 'addactivity',
        name: 'addactivity',
        component: () => import('@/views/eventAdvertising/addactivity'),
        meta: { title: '添加活动', icon: 'tree', roles: ['admin', 'editor'] },
        hidden: true
      },
      {
        path: 'recyclebin',
        name: 'recyclebin',
        component: () => import('@/views/eventAdvertising/recyclebin'),
        meta: { title: '回收站', icon: 'tree', roles: ['admin', 'editor'] },
        hidden: true
      }
    ]
  },
  {
    path: '/resourcemanagement',
    name: 'resourcemanagement',
    component: Layout,
    // redirect: '/resourcemanagement/classify-list',
    meta: { title: '资源管理', icon: 'example' },
    children: [
      {
        path: 'classify-list',
        name: 'classify-list',
        component: () => import('@/views/resourceManagement/materialManagement/classifyList'),
        meta: { title: '素材管理', icon: 'table', roles: ['admin', 'editor'] }
      },
      {
        path: 'update-classify',
        name: 'update-classify',
        component: () => import('@/views/resourceManagement/materialManagement/updateClassify'),
        meta: { title: '修改分类名称', icon: 'example', roles: ['admin', 'editor'] },
        hidden: true
      },
      {
        path: 'add-classify',
        name: 'add-classify',
        component: () => import('@/views/resourceManagement/materialManagement/updateClassify'),
        meta: { title: '添加分类', icon: 'example', roles: ['admin', 'editor'] },
        hidden: true
      },
      {
        path: 'material-list',
        name: 'material-list',
        component: () => import('@/views/resourceManagement/materialManagement/materialList'),
        meta: { title: '素材列表', icon: 'table', roles: ['admin', 'editor'] },
        hidden: true
      },
      {
        path: 'edit-material',
        name: 'edit-material',
        hidden: true,
        component: () => import('@/views/resourceManagement/materialManagement/editMaterial'),
        meta: { title: '编辑素材', icon: 'example', roles: ['admin', 'editor'] }
      },
      {
        path: 'add-material',
        name: 'add-material',
        hidden: true,
        component: () => import('@/views/resourceManagement/materialManagement/editMaterial'),
        meta: { title: '添加素材', icon: 'example', roles: ['admin', 'editor'] }
      },
      {
        path: 'check-text',
        name: 'check-text',
        hidden: true,
        component: () => import('@/views/resourceManagement/materialManagement/checkMaterialText'),
        meta: { title: '审核素材 - 文本', icon: 'example', roles: ['admin', 'editor'] }
      },
      {
        path: 'check-img',
        name: 'check-img',
        hidden: true,
        component: () => import('@/views/resourceManagement/materialManagement/checkMaterialImg'),
        meta: { title: '审核素材 -  图片', icon: 'example', roles: ['admin', 'editor'] }
      },
      {
        path: 'recyclebin',
        name: 'resourceRecyclebin',
        hidden: true,
        component: () => import('@/views/resourceManagement/recyclebin'),
        meta: { title: '回收站', icon: 'tree', roles: ['admin', 'editor'] }
      },
      {
        path: 'crowdManagement',
        name: 'crowdManagement',
        component: () => import('@/views/crowdManagement/crowdList'),
        meta: { title: '人群管理', icon: 'example' }
      }
    ]
  },
  {
    path: '/updateManagement',
    name: '更新管理',
    component: Layout,
    meta: { title: '更新管理', icon: 'example' },
    children: [
      {
        path: 'install',
        name: 'Install',
        component: () => import('@/views/updateManagement/install'),
        meta: { title: '安装包更新', icon: 'table', roles: ['admin', 'editor'] }
      },
      {
        path: 'prompt',
        name: 'Prompt',
        component: () => import('@/views/updateManagement/prompt'),
        meta: { title: '版本更新提示', icon: 'tree', roles: ['admin', 'editor'] }
      },
      {
        path: 'redpointer',
        name: 'Redpointer',
        component: () => import('@/views/updateManagement/redpointer'),
        meta: { title: '红点引导', icon: 'tree', roles: ['admin', 'editor'] }
      },
      {
        path: 'addpointer',
        name: 'addPointer',
        hidden: true,
        component: () => import('@/views/updateManagement/redpointer/addPointer'),
        meta: { title: '添加红点', icon: 'tree', roles: ['admin', 'editor'] }
      },
      {
        path: 'pricefees',
        name: 'Pricefees',
        component: () => import('@/views/updateManagement/pricefees'),
        meta: { title: '费率和限额', icon: 'table', roles: ['admin', 'editor'] }
      },
      {
        path: 'tos',
        name: 'Tos',
        component: () => import('@/views/updateManagement/tos'),
        meta: { title: '服务协议', icon: 'table', roles: ['admin', 'editor'] }
      }
    ]
  },
  {
    path: '/system',
    name: '后台管理',
    component: Layout,
    meta: { title: '系统设置', icon: 'example' },
    children: [
      {
        path: 'management',
        name: '权限管理',
        component: () => import('@/views/backManagement/index'),
        meta: { title: '权限管理', icon: 'table', roles: ['admin', 'editor'] }
      }, {
        path: 'editRole/:rolename',
        name: '编辑权限',
        hidden: true,
        component: () => import('@/views/backManagement/roleManagement/editRole')
      }
    ]
  },
  {
    path: '/crowdManagement',
    name: '人群管理',
    hidden: true,
    component: Layout,
    meta: { title: '人群管理', icon: 'example', roles: ['admin', 'editor'] },
    children: [
      {
        path: 'crowdList',
        name: 'crowdList',
        hidden: true,
        component: () => import('@/views/crowdManagement/crowdList'),
        meta: { title: '人群列表', icon: 'table', roles: ['admin', 'editor'] }
      },
      {
        path: 'crowdEdit',
        name: 'crowdEdit',
        hidden: true,
        component: () => import('@/views/crowdManagement/crowdEdit'),
        meta: { title: '添加人群', icon: 'tree', roles: ['admin', 'editor'] }
      },
      {
        path: 'recyclebin',
        name: 'crowdRecyclebin',
        hidden: true,
        component: () => import('@/views/crowdManagement/recyclebin'),
        meta: { title: '回收站', icon: 'tree', roles: ['admin', 'editor'] }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
