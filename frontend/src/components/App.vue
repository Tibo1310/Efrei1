<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <AppHeader @showAddItem="showAddItem" @showItemList="showItemList" @showRegister="showRegister" @showLogin="showLogin" />
    <main class="flex-grow-1">
      <div class="container mt-4">
        <h1 class="text-center mb-4">Welcome to My Website</h1>
        <AddItem v-if="view === 'add'" />
        <ItemList v-if="view === 'list'" />
        <!-- Add placeholders for Register and Login views -->
        <div v-if="view === 'register'">Register Form Placeholder</div>
        <div v-if="view === 'login'">Login Form Placeholder</div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script>
import AddItem from './AddItem.vue';
import ItemList from './ItemList.vue';
import AppHeader from './AppHeader.vue';
import AppFooter from './AppFooter.vue';

export default {
  data() {
    return {
      view: 'add'
    };
  },
  components: {
    AddItem,
    ItemList,
    AppHeader,
    AppFooter
  },
  methods: {
    showAddItem() {
      this.view = 'add';
    },
    showItemList() {
      this.view = 'list';
    },
    showRegister() {
      this.view = 'register';
    },
    showLogin() {
      this.view = 'login';
    }
  }
};
</script>

<style scoped>
.navbar-nav .nav-link {
  color: rgba(255, 255, 255, 0.8);
  transition: color 0.3s ease;
}

.navbar-nav .nav-link:hover {
  color: #ffffff;
}
</style>
