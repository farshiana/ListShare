import { createRouter, createWebHistory } from 'vue-router'
import NewList from '../views/NewList.vue'
import List from '../views/List.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/lists',
      name: 'lists',
      component: NewList
    },
    {
      path: '/lists/:id',
      name: 'list',
      component: List
    },
    {
      path: '/',
      redirect: '/lists'
    },
  ]
})

export default router
