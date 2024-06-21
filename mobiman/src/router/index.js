import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import EmployeeView from '../views/EmployeeView.vue';
import UpdateEmployee from '../views/UpdateEmployee.vue';
import NotFound from '../views/NotFound.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView

    },
    {
      path: '/view/:id',
      name: 'employee',
      component: EmployeeView
    },
    {
      path: '/edit/:id',
      name: 'update',
      component: UpdateEmployee
    },
    {
      path: '/:catchAll(.*)',
      name: "NotFound",
      component: NotFound

    }
  ]
})

export default router
