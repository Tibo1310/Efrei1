<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <AppHeader ref="header" />
    <main class="flex-grow-1 content-wrapper">
      <div class="container mt-4 mb-4">
        <router-view></router-view>
      </div>
    </main>
    <AppFooter :isHidden="isFooterHidden" />
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
  data() {
    return {
      isFooterHidden: false,
      lastScrollPosition: 0
    }
  },
  mounted() {
    eventBus.on('login', () => {
      if (this.$refs.header) {
        this.$refs.header.checkLoginStatus();
      }
    });
    window.addEventListener('scroll', this.onScroll);
  },
  beforeUnmount() {
    eventBus.off('login');
    window.removeEventListener('scroll', this.onScroll);
  },
  methods: {
    onScroll() {
      const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      if (currentScrollPosition < 0) {
        return;
      }
      if (Math.abs(currentScrollPosition - this.lastScrollPosition) < 60) {
        return;
      }
      this.isFooterHidden = currentScrollPosition > this.lastScrollPosition;
      this.lastScrollPosition = currentScrollPosition;
    }
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
  padding-bottom: 70px;
}

body {
  padding-top: 30px;
}

.content-wrapper {
  transition: margin-bottom 0.3s ease;
}

.footer-hidden + .content-wrapper {
  margin-bottom: 0;
}
</style>
