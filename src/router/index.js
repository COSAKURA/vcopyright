import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'loginRegister',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/auditorhomeView',
    name: 'auditorhomeView',
    component: () => import('../views/auditor/auditorHomeView.vue')
  },
  {
    path: '/creatorHomeView',
    name: 'creatorHomeView',
    component: () => import('../views/creator/creatorHomeView.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
