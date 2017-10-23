import Vue from 'vue'
import Router from 'vue-router'
import index from '../pages/index.vue'
import signup from '../pages/signup.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/signup',
      name: 'signup',
      component: signup,
    },
    {
      path: '/',
      name: 'index',
      component: index,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
})
