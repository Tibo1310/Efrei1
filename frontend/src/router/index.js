import { createRouter, createWebHistory } from 'vue-router';
import AddItem from '../components/AddItem.vue';
import ItemList from '../components/ItemList.vue';
import HomePage from '../components/HomePage.vue';
import UserRegister from '../components/UserRegister.vue';
import UserLogin from '../components/UserLogin.vue';

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
    path: '/list',
    name: 'ItemList',
    component: ItemList
  },
  {
    path: '/register',
    name: 'UserRegister',
    component: UserRegister
  },
  {
    path: '/login',
    name: 'UserLogin',
    component: UserLogin
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
