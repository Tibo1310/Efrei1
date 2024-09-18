<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <AppHeader ref="header" />
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
  },
  mounted() {
    this.$root.$on('login', () => {
      if (this.$refs.header) {
        this.$refs.header.checkLoginStatus();
      }
    });
  }
};
</script>

<style>
#app {
  font-family: 'Arial', sans-serif;
}
</style>
