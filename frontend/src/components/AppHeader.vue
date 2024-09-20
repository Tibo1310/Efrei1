<template>
  <nav class="navbar navbar-expand-lg navbar-dark custom-navbar fixed-top">
    <div class="container">
      <div class="d-flex align-items-center">
        <router-link class="navbar-brand d-flex align-items-center" to="/">
          <img src="/logo.png" alt="Logo" class="me-2" style="height: 30px;">
          Spella
        </router-link>
      </div>
      <div class="d-flex align-items-center">
        <div v-if="isLoggedIn" class="d-flex align-items-center me-3">
          <span class="text-light me-2">{{ username }}</span>
          <div class="user-icon" @click="showIconSelector = true">
            <img v-if="userIcon && userIcon.startsWith('/uploads/')" :src="`http://localhost:5000${userIcon}`" class="custom-icon" />
            <i v-else :class="userIcon"></i>
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
              <router-link class="nav-link" to="/profile">Mon profil</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/activity">Mes activités</router-link>
            </li>
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
import { mapGetters, mapActions } from 'vuex'
import IconSelector from './IconSelector.vue';

export default {
  name: 'AppHeader',
  components: {
    IconSelector
  },
  data() {
    return {
      showIconSelector: false
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'username', 'userIcon'])
  },
  created() {
    this.checkLoginStatus();
  },
  methods: {
    ...mapActions(['logout', 'checkLoginStatus', 'updateUserIcon']),
    handleLogout() {
      this.logout();
      this.$router.push('/login');
    },
    async selectIcon(icon) {
      try {
        await this.updateUserIcon(icon);
        this.showIconSelector = false;
      } catch (error) {
        console.error('Error updating icon:', error);
        alert('Failed to update icon. Please try again.');
      }
    }
  }
};
</script>

<style scoped>
.custom-navbar {
  background-color: #17255A;
  border-bottom: 2px solid white;
}

.navbar {
  box-shadow: 0 2px 4px rgba(0,0,0,.1);
}

.navbar-brand {
  font-weight: bold;
  font-size: 1.5rem;
}

.navbar-brand img {
  transition: transform 0.3s ease;
}

.navbar-brand:hover img {
  transform: scale(1.1);
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

.custom-icon {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}
</style>