import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/index/Index'
import Member from '@/pages/member/Member'
import Contact from '@/pages/contact/Contact'
import Sign from '@/pages/signContact/Index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '登录',
      component: Index
    },
    {
      path: '/member',
      name: 'Member',
      component: Member
    },
    {
      path: '/contact',//合同页面
      name: 'contact',
      component: Contact
    },
    {
      path: '/signContact',
      name: 'signContact',
      component: Sign 
      },
  ]
})
