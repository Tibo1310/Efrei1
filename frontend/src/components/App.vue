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
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Roboto:wght@400;700&display=swap');

#app {
  font-family: 'Roboto', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Poppins', sans-serif;
}

main {
  padding-bottom: 70px; /* Increased padding to account for the fixed footer */
}
</style>
