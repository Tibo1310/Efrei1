import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import UserRegister from '../components/UserRegister.vue';
import UserLogin from '../components/UserLogin.vue';
import PrivacyPolicy from '../components/PrivacyPolicy.vue';
import TermsOfService from '../components/TermsOfService.vue';
import ContactUs from '../components/ContactUs.vue';
import UserProfile from '../components/UserProfile.vue'; // Import the UserProfile component
import store from '../store'; // Importez le store
import UserActivity from '../components/UserActivity.vue'; // Import the Activity component

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
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
  },
  {
    path: '/privacypolicy',
    name: 'PrivacyPolicy',
    component: PrivacyPolicy
  },
  {
    path: '/termsofservice',
    name: 'TermsOfService',
    component: TermsOfService
  },
  {
    path: '/contactus',
    name: 'ContactUs',
    component: ContactUs
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: true } // Ajoutez cette ligne pour indiquer que cette route nécessite une authentification
  },
  {
    path: '/activity',
    name: 'UserActivity',
    component: UserActivity,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Ajoutez un guard de navigation
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && !store.getters.isLoggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;
