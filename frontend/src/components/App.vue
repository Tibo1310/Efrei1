<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <AppHeader />
    <main class="flex-grow-1">
      <div class="container mt-4">
        <router-view></router-view>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from './AppHeader.vue';
import AppFooter from './AppFooter.vue';

export default {
  components: {
    AppHeader,
    AppFooter
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
