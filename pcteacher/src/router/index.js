import Vue from 'vue'
import Router from 'vue-router'

// 异步页面
const list =r => require.ensure([], () => r(require('@/views/list.vue')), 'rt-list')
const demo1 =r => require.ensure([], () => r(require('@/views/demo1.vue')), 'rt-demo1')
const demo2 =r => require.ensure([], () => r(require('@/views/demo2.vue')), 'rt-demo2')

Vue.use(Router)


export default new Router({
  // 默认 hash 模式 ，当前为 路由的 history 模式
  // mode: 'history',

  routes: [
    {
      path: '/',
      name: 'index',
      component: list
    },
    {
      path: '/demo1',
      name: 'demo1',
      component: demo1,
    },
    {
      path: '/demo2',
      name: 'demo2',
      component: demo2,
    },
  ]
})
