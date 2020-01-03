import Vue from 'vue'
import Router from 'vue-router'
import FrontIndex from '@/components/front/index'
import BackIndex from '@/components/back/index'

Vue.use(Router)

export default new Router({
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
