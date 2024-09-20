<template>
  <footer class="custom-footer py-3 fixed-bottom">
    <div class="container">
      <div class="row">
        <div class="col-12 text-center">
          <router-link to="/privacypolicy" class="text-white me-3">Privacy Policy</router-link>
          <router-link to="/termsofservice" class="text-white me-3">Terms of Service</router-link>
          <router-link to="/contactus" class="text-white">Contact Us</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
};
</script>

<style scoped>
.custom-footer {
  background-color: #BD1E1E;
  color: white;
  border-top: 2px solid white;
}

/* Ajoutez d'autres styles si nécessaire */
</style>