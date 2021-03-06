import router from './router'
import store from './store/index.ts'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken, setToken } from '@/utils/auth' // 验权

// permissiom judge function
function hasPermission (roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    // if (to.path === '/login') {
    //   next({ path: '/' })
    //   NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    // } else {
    if (store.getters.roles.length === 0) {
      // wait for /v1/admin_user api ok
      store.dispatch('GetUserPermissonInfo').then(res => { // 拉取用户信息
        const roles = res.rolename // note: roles must be a array! such as: ['editor','develop']
        console.log('respone:', res)
        store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
          router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
          next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
        })
      // wait for /v1/admin_user api ok
      })
      .catch(() => {
        store.dispatch('FedLogOut').then(() => {
          Message.error('验证失败,请重新登录')
          next({ path: '/login' })
        })
      })
      next()
    } else {
      // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
      if (hasPermission(store.getters.roles, to.meta.roles)) {
        next()//
      } else {
        next({ path: '/401', replace: true, query: { noGoBack: true } })
      }
    }
    // }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      if (to.query.code) {
        store.dispatch('GetUserInfo', { code: to.query.code }).then((res) => { // 拉取用户信息
          const roles = res.rolename // note: roles must be a array! such as: ['editor','develop']
          store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
          next('/')
        }).catch(() => {
          store.dispatch('FedLogOut').then(() => {
            Message.error('验证失败,请重新登录')
            next({ path: '/login' })
          })
        })
      } else {
        next('/login')
      }
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
