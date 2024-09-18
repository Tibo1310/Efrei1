<template>
  <footer class="footer bg-light">
    <div class="container">
      <div class="row">
        <div class="col-12 text-center">
          <router-link to="/privacypolicy" class="text-muted me-3">Privacy Policy</router-link>
          <router-link to="/termsofservice" class="text-muted me-3">Terms of Service</router-link>
          <router-link to="/contactus" class="text-muted">Contact Us</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  }
};
</script>

<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  box-shadow: 0 -2px 4px rgba(0,0,0,.05);
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  z-index: 1000;
}

footer a {
  text-decoration: none;
  transition: color 0.3s ease;
}

footer a:hover {
  color: #007bff !important;
}
</style>