<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <router-link class="navbar-brand" to="/">My App</router-link>
      <div class="d-flex align-items-center">
        <div v-if="isLoggedIn" class="d-flex align-items-center me-3">
          <span class="text-light me-2">{{ username }}</span>
          <div class="user-icon" @click="showIconSelector = true">
            <i :class="userIcon"></i>
          </div>
        </div>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/create">Add Item</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/list">Item List</router-link>
          </li>
          <template v-if="!isLoggedIn">
            <li class="nav-item">
              <router-link class="nav-link" to="/register">Register</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <a @click.prevent="logout" class="nav-link" href="#">Logout</a>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <IconSelector v-if="showIconSelector" @close="showIconSelector = false" @select-icon="selectIcon" />
  </nav>
</template>

<script>
import IconSelector from './IconSelector.vue';

export default {
  name: 'AppHeader',
  components: {
    IconSelector
  },
  data() {
    return {
      isLoggedIn: false,
      username: '',
      userIcon: 'fas fa-user-circle',
      showIconSelector: false
    }
  },
  created() {
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');
      const userIcon = localStorage.getItem('userIcon') || 'fas fa-user-circle';
      if (token && username) {
        this.isLoggedIn = true;
        this.username = username;
        this.userIcon = userIcon;
      }
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('userIcon');
      this.isLoggedIn = false;
      this.username = '';
      this.userIcon = 'fas fa-user-circle';
      this.$router.push('/login');
    },
    selectIcon(icon) {
      this.userIcon = icon;
      localStorage.setItem('userIcon', icon);
      this.showIconSelector = false;
      // Here you would typically send an API request to update the user's icon in the database
    }
  }
};
</script>

<style scoped>
.navbar {
  box-shadow: 0 2px 4px rgba(0,0,0,.1);
}

.navbar-brand {
  font-weight: bold;
  font-size: 1.5rem;
}

.navbar-nav .nav-link {
  color: rgba(255, 255, 255, 0.8);
  transition: color 0.3s ease;
  cursor: pointer;
  font-weight: 500;
}

.navbar-nav .nav-link:hover {
  color: #ffffff;
}

.navbar-toggler {
  border: none;
}

@media (max-width: 991px) {
  .navbar-nav {
    padding-top: 1rem;
  }
}

.user-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.user-icon i {
  color: #007bff;
}
</style>