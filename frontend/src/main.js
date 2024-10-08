import { createApp } from 'vue'
import App from './components/App.vue'
import router from './router'
import store from './store'

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

createApp(App).use(router).use(store).mount('#app');