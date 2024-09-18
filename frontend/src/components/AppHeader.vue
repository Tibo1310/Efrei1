<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <div class="d-flex align-items-center">
        <router-link class="navbar-brand d-flex align-items-center" to="/">
          <img src="/logo.png" alt="Logo" class="me-2" style="height: 30px;">
          My App
        </router-link>
      </div>
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
      showIconSelector: false,
      userId: null // Ajout de l'ID de l'utilisateur
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
      const userId = localStorage.getItem('userId');
      if (token && username && userId) {
        this.isLoggedIn = true;
        this.username = username;
        this.userIcon = userIcon;
        this.userId = userId;
      }
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('userIcon');
      localStorage.removeItem('userId');
      this.isLoggedIn = false;
      this.username = '';
      this.userIcon = 'fas fa-user-circle';
      this.userId = null;
      this.$router.push('/login');
    },
    async selectIcon(icon) {
      console.log('Updating icon for user:', this.userId);
      this.userIcon = icon;
      localStorage.setItem('userIcon', icon);
      this.showIconSelector = false;
      
      try {
        const response = await fetch('http://localhost:5000/user/icon', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            userId: this.userId,
            icon: icon
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to update icon');
        }
        
        const data = await response.json();
        console.log(data.message);
      } catch (error) {
        console.error('Error updating icon:', error);
        alert('Failed to update icon. Please try again.');
      }
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
</style>