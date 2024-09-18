<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <AppHeader ref="header" />
    <main class="flex-grow-1">
      <div class="container mt-4 mb-4">
        <router-view></router-view>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from './AppHeader.vue';
import AppFooter from './AppFooter.vue';
import { eventBus } from '../eventBus';

export default {
  components: {
    AppHeader,
    AppFooter
  },
  mounted() {
    eventBus.on('login', () => {
      if (this.$refs.header) {
        this.$refs.header.checkLoginStatus();
      }
    });
  },
  beforeUnmount() {
    eventBus.off('login');
  }
};
</script>

<style>
#app {
  font-family: 'Arial', sans-serif;
}

main {
  padding-bottom: 60px; /* Add padding to the bottom of the main content to account for the footer height */
}
</style>
