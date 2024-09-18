<template>
  <footer class="bg-light py-4 mt-4">
    <div class="container">
      <div class="row">
        <div class="col-md-6 text-center text-md-start">
          <p class="mb-0">&copy; {{ currentYear }} My App. All rights reserved.</p>
        </div>
        <div class="col-md-6 text-center text-md-end">
          <a href="#" class="text-muted me-2">Privacy Policy</a>
          <a href="#" class="text-muted me-2">Terms of Service</a>
          <a href="#" class="text-muted">Contact Us</a>
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
footer {
  box-shadow: 0 -2px 4px rgba(0,0,0,.05);
}

footer a {
  text-decoration: none;
  transition: color 0.3s ease;
}

footer a:hover {
  color: #007bff !important;
}
</style>