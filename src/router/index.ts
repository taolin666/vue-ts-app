import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import _ from 'lodash'
import store from '@/store'
import type { StateAll } from '@/store'

const Login = () => import('@/views/Login/Login.vue');
const Home = () => import('@/views/Home/Home.vue');
const Sign = () => import('@/views/Sign/Sign.vue');
const Exception = () => import('@/views/Exception/Exception.vue');
const Apply = () => import('@/views/Apply/Apply.vue');
const Check = () => import('@/views/Check/Check.vue');

declare module 'vue-router' {
  interface RouteMeta {
    menu?: boolean
    title?: string
    icon?: string 
    auth?: boolean
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home,
    redirect: '/sign',
    meta: {
      menu: true,
      title: '考勤管理',
      icon: 'document-copy',
      auth: true
    },
    children: [
      {
        path: 'sign',
        name: 'sign',
        component: Sign,
        meta: {
          menu: true,
          title: '在线打卡签到',
          icon: 'calendar',
          auth: true
        },
        beforeEnter: (to, from, next) => {
          const usersInfo = (store.state as StateAll).users.infos
          const signsInfo = (store.state as StateAll).signs.infos
          if (_.isEmpty(signsInfo)) {
            store.dispatch('signs/getTime', {userId: usersInfo._id}).then(res => {
              if (res.data.errcode === 0) {
                store.commit('signs/updateInfos',res.data.infos)
                next()
              }
            })
          } else {
            next()
          }
        }
      },
      {
        path: 'exception',
        name: 'exception',
        component: Exception,
        meta: {
          menu: true,
          title: '异常考勤查询',
          icon: 'warning',
          auth: true,
        },
        beforeEnter: (to, from, next) => {
          const usersInfo = (store.state as StateAll).users.infos
          const signsInfo = (store.state as StateAll).signs.infos
          if (_.isEmpty(signsInfo)) {
            store.dispatch('signs/getTime', {userId: usersInfo._id}).then(res => {
              if (res.data.errcode === 0) {
                store.commit('signs/updateInfos',res.data.infos)
                next()
              }
            })
          } else {
            next()
          }
        }
      },
      {
        path: 'apply',
        name: 'apply',
        component: Apply,
        meta: {
          menu: true,
          title: '添加考勤审批',
          icon: 'document-add',
          auth: true,
        },
        beforeEnter: (to, from, next) => {
          const usersInfo = (store.state as StateAll).users.infos
          const checkApplyList = (store.state as StateAll).checks.applyList
          if (_.isEmpty(checkApplyList)) {
            store.dispatch('checks/getApply', {applicantId: usersInfo._id}).then(res => {
              if (res.data.errcode === 0) {
                store.commit('checks/updateApplyList',res.data.rets)
                next()
              }
            })
          } else {
            next()
          }
        }
      },
      {
        path: 'check',
        name: 'check',
        component: Check,
        meta: {
          menu: true,
          title: '我的考勤审批',
          icon: 'finished',
          auth: true,
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next)=>{
  const token = (store.state as StateAll).users.token;
  const infos = (store.state as StateAll).users.infos;
  if( to.meta.auth && _.isEmpty(infos) ){
    if(token){
      store.dispatch('users/infos').then((res)=>{
        if(res.data.errcode === 0){
          store.commit('users/updateInfos', res.data.infos)
          next()
        }
      });
    }
    else{
      next('/login');
    }
  }
  else{
    if(token && to.path === '/login' ){
      next('/');
    }
    else{
      next();
    }
  }

})

export default router
