<template>
  <footer class="custom-footer py-3 fixed-bottom" :class="{ 'footer-hidden': isHidden }">
    <div class="container">
      <div class="row">
        <div class="col-12 text-center">
          <router-link to="/privacypolicy" class="text-white me-3">Confidentialité</router-link>
          <router-link to="/termsofservice" class="text-white me-3">Utilisation</router-link>
          <router-link to="/contactus" class="text-white">Contactez-nous</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  props: ['isHidden']
};
</script>

<style scoped>
.custom-footer {
  background-color: black;
  color: white;
  border-top: 2px solid white;
  transition: transform 0.3s ease;
}

.footer-hidden {
  transform: translateY(100%);
}

</style>