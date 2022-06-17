import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/user/users.vue'
import Rights from '../components/power/rights.vue'
import Roles from '../components/power/roles.vue'
import Categories from '../components/goods/categories.vue'
import Params from "../components/goods/params"
import Goods from "../components/goods/goods"
import Addgoods from "../components/goods/addgoods"
import Reports from "../components/reports/reports"


Vue.use(VueRouter)

const routes = [

  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Categories },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/goods/addgoods', component: Addgoods },
      { path: '/reports', component: Reports }
    ]
  },
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
// to  将要访问的路径
// from 代表从哪个路径跳转而来
// next 是一个函数，表示放行    next() 放行  next('/login') 强制跳转
router.beforeEach((to, from, next) => {
  if (to.path === '/login')
    return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr)
    return next('/login')
  next()
})


export default router
