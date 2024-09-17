import { createRouter, createWebHistory } from 'vue-router';
import AddItem from '../components/AddItem.vue';
import ItemList from '../components/ItemList.vue';
import HomePage from '../components/HomePage.vue';

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/create',
    name: 'CreateItem',
    component: AddItem
  },
  {
    path: '/items',
    name: 'ItemList',
    component: ItemList
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
