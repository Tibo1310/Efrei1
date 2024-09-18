<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <a class="navbar-brand" href="#">My App</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a class="nav-link" href="#" @click.prevent="$emit('showAddItem')">Add Item</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" @click.prevent="$emit('showItemList')">Item List</a>
          </li>
          <li class="nav-item d-lg-none">
            <a class="nav-link" href="#" @click.prevent="$emit('showRegister')">Register</a>
          </li>
          <li class="nav-item d-lg-none">
            <a class="nav-link" href="#" @click.prevent="$emit('showLogin')">Login</a>
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