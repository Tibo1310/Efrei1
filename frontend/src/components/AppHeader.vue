<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <router-link class="navbar-brand" to="/">My App</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/create">Add Item</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/list">Item List</router-link>
          </li>
          <li class="nav-item d-lg-none">
            <router-link class="nav-link" to="/register">Register</router-link>
          </li>
          <li class="nav-item d-lg-none">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppHeader'
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