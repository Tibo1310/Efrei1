<template>
  <nav class="navbar navbar-expand-lg navbar-dark custom-navbar fixed-top" :class="{ 'navbar-hidden': isHidden }">
    <div class="container">
      <!-- Logo et nom de l'application -->
      <router-link class="navbar-brand d-flex align-items-center" to="/" @click="closeNavbar">
        <img src="/logo.png" alt="Logo" class="me-2" style="height: 30px;">
        Spella
      </router-link>

      <!-- User info for mobile -->
      <div class="d-flex align-items-center d-lg-none me-2">
        <div v-if="isLoggedIn" class="user-info-mobile">
          <div class="user-icon" @click="showIconSelector = true">
            <img v-if="userIcon && userIcon.startsWith('/uploads/')" :src="`http://localhost:5000${userIcon}`" class="custom-icon" alt="User icon" />
            <i v-else :class="userIcon"></i>
          </div>
          <span class="text-light ms-2">{{ username }}</span>
        </div>
      </div>

      <!-- Bouton de bascule pour les petits écrans -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Contenu de la barre de navigation -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav mx-auto">
          <!-- Liens du milieu (visibles sur desktop et mobile pour les utilisateurs connectés) -->
          <li class="nav-item" v-if="isLoggedIn">
            <router-link class="nav-link" to="/profile" @click="closeNavbar">Mon profil</router-link>
          </li>
          <li class="nav-item" v-if="isLoggedIn">
            <router-link class="nav-link" to="/activity" @click="closeNavbar">Mes activités</router-link>
          </li>
        </ul>

        <!-- Éléments de droite -->
        <ul class="navbar-nav ms-auto">
          <template v-if="!isLoggedIn">
            <li class="nav-item">
              <router-link class="nav-link" to="/register" @click="closeNavbar">Register</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/login" @click="closeNavbar">Login</router-link>
            </li>
          </template>
          <template v-else>
            <!-- Icône et nom d'utilisateur (visibles uniquement sur desktop) -->
            <li class="nav-item d-none d-lg-flex align-items-center me-3">
              <div class="user-icon" @click="showIconSelector = true">
                <img v-if="userIcon && userIcon.startsWith('/uploads/')" :src="`http://localhost:5000${userIcon}`" class="custom-icon" alt="User icon" />
                <i v-else :class="userIcon"></i>
              </div>
              <span class="text-light ms-2">{{ username }}</span>
            </li>
            <!-- Bouton de déconnexion -->
            <li class="nav-item">
              <a @click.prevent="handleLogout" class="nav-link" href="#">Logout</a>
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
      showIconSelector: false,
      isHidden: false,
      lastScrollPosition: 0
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'username', 'userIcon'])
  },
  created() {
    this.checkLoginStatus();
    window.addEventListener('scroll', this.onScroll);
  },
  unmounted() {
    window.removeEventListener('scroll', this.onScroll);
  },
  methods: {
    ...mapActions(['logout', 'checkLoginStatus', 'updateUserIcon']),
    handleLogout() {
      this.logout();
      this.$router.push('/login');
      this.closeNavbar();
    },
    async selectIcon(icon) {
      try {
        await this.updateUserIcon(icon);
        this.showIconSelector = false;
      } catch (error) {
        console.error('Error updating icon:', error);
        alert('Failed to update icon. Please try again.');
      }
    },
    onScroll() {
      const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      if (currentScrollPosition < 0) {
        return;
      }
      if (Math.abs(currentScrollPosition - this.lastScrollPosition) < 60) {
        return;
      }
      this.isHidden = currentScrollPosition > this.lastScrollPosition;
      this.lastScrollPosition = currentScrollPosition;
    },
    closeNavbar() {
      const navbarToggler = document.querySelector('.navbar-toggler');
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse.classList.contains('show')) {
        navbarToggler.click();
      }
    }
  }
};
</script>

<style scoped>
.custom-navbar {
  background-color: black;
  border-bottom: 2px solid white;
  transition: transform 0.3s ease;
}

.navbar-hidden {
  transform: translateY(-100%);
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

/* Ajoutez ces styles pour ajuster l'apparence si nécessaire */
.navbar-nav .nav-item {
  display: flex;
  align-items: center;
}

@media (max-width: 991px) {
  .navbar-nav {
    flex-direction: column;
  }
  
  .nav-item {
    margin-bottom: 10px;
  }
}

.user-info-mobile {
  display: flex;
  align-items: center;
}

.user-info-mobile .user-icon {
  width: 30px;
  height: 30px;
}

.user-info-mobile .custom-icon {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.user-info-mobile span {
  font-size: 0.9rem;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 991px) {
  .navbar-brand {
    max-width: 50%;
  }
}
</style>