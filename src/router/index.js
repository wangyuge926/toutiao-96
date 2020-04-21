import Vue from 'vue'
import VueRouter from 'vue-router'

// 在 VueCLI 创建的项目中 @ 表示 src 目录
// 它是 src 目录的路径别名
// 好处: 它不受当前文件路径影响
// 注意: @ 就是 src 路径, 后面别忘了写那个斜杠
// 建议: 如果加载的资源路径就在当前目录下, 那就正常写
//       如果需要进行父级路径查找的都使用 @
import Login from '@/views/login/'
import Home from '@/views/home/'
import Layout from '@/views/layout/'

Vue.use(VueRouter)

// 路由配置表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    // 命名路由 layout 有一个默认路由, 这个名字没有意义, 所以警告
    // 正确的做法: 如果有默认的子路由, 就不要给父路由起名字
    // name: 'layout',
    component: Layout,
    children: [
      {
        path: '',
        name: 'home',
        component: Home
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
