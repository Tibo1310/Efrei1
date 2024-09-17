<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" href="#">My App</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="showAddItem">Add Item</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="showItemList">Item List</a>
            </li>
            <li class="nav-item d-lg-none">
              <a class="nav-link" href="#" @click.prevent="showRegister">Register</a>
            </li>
            <li class="nav-item d-lg-none">
              <a class="nav-link" href="#" @click.prevent="showLogin">Login</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

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

    <footer class="bg-light py-3 mt-4">
      <div class="container text-center">
        <p class="mb-0">&copy; 2024 My App. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import AddItem from './AddItem.vue';
import ItemList from './ItemList.vue';

export default {
  data() {
    return {
      view: 'add'
    };
  },
  components: {
    AddItem,
    ItemList
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
