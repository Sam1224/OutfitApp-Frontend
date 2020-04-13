import Vue from 'vue'
import Router from 'vue-router'
import statusCode from '@/common/js/status'
import store from '@/store/store'
import FrontIndex from '@/components/front/index/index'
import FrontLogin from '@/components/front/login/login'
import FrontRegister from '@/components/front/register/register'
import FrontHome from '@/components/front/home/home'
import FrontVirtualTryOnList from '@/components/front/outfit/vton-list/vton-list'
import FrontVirtualTryOn from '@/components/front/outfit/vton/vton'
import FrontVirtualTryOnDIY from '@/components/front/outfit/vton-diy/vton-diy'
import FrontRetrievalList from '@/components/front/outfit/retrieval-list/retrieval-list'
import FrontRetrieval from '@/components/front/outfit/retrieval/retrieval'
import FrontPersonal from '@/components/front/personal/personal'
import FrontUserEdit from '@/components/front/user-edit/user-edit'
import BackIndex from '@/components/back/index'
import BackLogin from '@/components/back/login/login'
import BackHome from '@/components/back/home/home'
import BackUsersIndex from '@/components/back/users/index/index'
import BackUsersList from '@/components/back/users/list/list'
import BackUsersAdd from '@/components/back/users/add/add'
import BackUsersEdit from '@/components/back/users/edit/edit'
import BackAdminsIndex from '@/components/back/admins/index/index'
import BackAdminsList from '@/components/back/admins/list/list'
import BackAdminsAdd from '@/components/back/admins/add/add'
import BackAdminsEdit from '@/components/back/admins/edit/edit'
import GithubRedirect from '@/components/back/login/githubredirect'
import GitlabRedirect from '@/components/back/login/gitlabredirect'
import GiteeRedirect from '@/components/back/login/giteeredirect'
import BitbucketRedirect from '@/components/back/login/bitbucketredirect'
import WeiboRedirect from '@/components/back/login/weiboredirect'

Vue.use(Router)

const router = new Router({
  linkActiveClass: 'active',
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'FrontIndex',
      component: FrontIndex,
      children: [
        {
          path: '',
          name: 'frontdefault',
          component: FrontHome
        },
        {
          path: 'login',
          name: 'userlogin',
          component: FrontLogin
        },
        {
          path: 'register',
          name: 'userregister',
          component: FrontRegister
        },
        {
          path: 'home',
          name: 'userhome',
          component: FrontHome
        },
        {
          path: 'vton-list',
          name: 'virtual-try-on-list',
          component: FrontVirtualTryOnList,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'vton',
          name: 'virtual-try-on',
          component: FrontVirtualTryOn,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'vton-diy',
          name: 'virtual-try-on-diy',
          component: FrontVirtualTryOnDIY,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'retrieval-list',
          name: 'outfit-retrieval-list',
          component: FrontRetrievalList,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'retrieval',
          name: 'outfit-retrieval',
          component: FrontRetrieval,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'personal',
          name: 'front-personal',
          component: FrontPersonal,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'user-edit',
          name: 'front-user-edit',
          component: FrontUserEdit,
          meta: {
            requireAuth: true
          }
        }
      ]
    },
    {
      path: '/admin',
      component: BackIndex,
      children: [
        {
          path: 'githubredirect',
          name: 'githubredirect',
          component: GithubRedirect
        },
        {
          path: 'gitlabredirect',
          name: 'gitlabredirect',
          component: GitlabRedirect
        },
        {
          path: 'giteeredirect',
          name: 'giteeredirect',
          component: GiteeRedirect
        },
        {
          path: 'bitbucketredirect',
          name: 'bitbucketredirect',
          component: BitbucketRedirect
        },
        {
          path: 'weiboredirect',
          name: 'weiboredirect',
          component: WeiboRedirect
        },
        {
          path: '',
          name: 'admindefault',
          component: BackLogin
        },
        {
          path: 'login',
          name: 'adminlogin',
          component: BackLogin
        },
        {
          path: 'home',
          name: 'adminhome',
          component: BackHome,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'users',
          component: BackUsersIndex,
          meta: {
            requireAuth: true
          },
          children: [
            {
              path: '',
              name: 'usersdefault',
              component: BackUsersList
            },
            {
              path: 'list',
              name: 'userslist',
              component: BackUsersList
            },
            {
              path: 'add',
              name: 'usersadd',
              component: BackUsersAdd
            },
            {
              path: 'edit',
              name: 'usersedit',
              component: BackUsersEdit
            }
          ]
        },
        {
          path: 'admins',
          component: BackAdminsIndex,
          meta: {
            requireAuth: true
          },
          children: [
            {
              path: '',
              name: 'adminsdefault',
              component: BackAdminsList
            },
            {
              path: 'list',
              name: 'adminslist',
              component: BackAdminsList
            },
            {
              path: 'add',
              name: 'adminsadd',
              component: BackAdminsAdd
            },
            {
              path: 'edit',
              name: 'adminsedit',
              component: BackAdminsEdit
            }
          ]
        }
      ]
    }
  ]
})

// Router guarder
router.beforeEach((to, from, next) => {
  if (to.matched.some((r) => r.meta.requireAuth)) {
    if (store.state.token) {
      next()
    } else {
      let path = to.path
      if (path.indexOf('admin') >= 0) {
        // backend
        if (localStorage.token && localStorage.getItem('account') && localStorage.getItem('account').end === statusCode.BACKEND) {
          store.state.token = localStorage.token
          store.state.account = JSON.parse(localStorage.getItem('account'))
          next()
        } else {
          next({
            path: '/admin/login',
            query: {redirect: to.fullPath}
          })
        }
      } else {
        // frontend
        if (localStorage.token && localStorage.getItem('account') && localStorage.getItem('account').end === statusCode.FRONTEND) {
          store.state.token = localStorage.token
          store.state.account = JSON.parse(localStorage.getItem('account'))
          next()
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
