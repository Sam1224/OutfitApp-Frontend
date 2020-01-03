import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/store'
import FrontIndex from '@/components/front/index'
import BackIndex from '@/components/back/index'

Vue.use(Router)

const router = new Router({
  linkActiveClass: 'active',
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'FrontIndex',
      component: FrontIndex
    },
    {
      path: '/admin',
      name: 'BackIndex',
      component: BackIndex
    }
  ]
})

// Router guarder
router.beforeEach((to, from, next) => {
  if (to.matched.some((r) => r.meta.requireAuth)) {
    if (store.state.token) {
      next()
    } else {
      if (localStorage.token && localStorage.getItem('account')) {
        store.state.token = localStorage.token
        store.state.account = JSON.parse(localStorage.getItem('account'))
        next()
      } else {
        let path = to.path
        if (path.indexOf('admin') >= 0) {
          next({
            path: '/admin/login',
            query: {redirect: to.fullPath}
          })
        } else {
          next({
            path: '/login',
            query: {redirect: to.fullPath}
          })
        }
      }
    }
  } else {
    next()
  }
})

export default router
