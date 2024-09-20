<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <AppHeader class="fixed-top" />
    <main class="flex-grow-1 mt-5 mb-5">
      <router-view></router-view>
    </main>
    <AppFooter class="fixed-bottom" />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import { mapActions } from 'vuex';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter
  },
  methods: {
    ...mapActions(['checkAuth', 'fetchUserActivities'])
  },
  async created() {
    await this.checkAuth();
    if (this.$store.getters.isLoggedIn) {
      await this.fetchUserActivities();
    }
  }
}
</script>

<style>
#app {
  padding-top: 56px; /* Ajustez cette valeur en fonction de la hauteur de votre navbar */
  padding-bottom: 60px; /* Ajustez cette valeur en fonction de la hauteur de votre footer */
}

main {
  overflow-y: auto;
}
</style>