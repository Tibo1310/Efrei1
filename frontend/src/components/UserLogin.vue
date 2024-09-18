<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">Login</h2>
    <form @submit.prevent="login" class="border p-4 rounded shadow-sm bg-light">
      <div class="mb-3">
        <label for="email" class="form-label">Email:</label>
        <input type="email" id="email" v-model="email" class="form-control" required>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password:</label>
        <input type="password" id="password" v-model="password" class="form-control" required>
      </div>
      <button type="submit" class="btn btn-primary w-100">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'UserLogin',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token);
          alert('Login successful');
          this.$router.push('/');
        } else {
          const data = await response.json();
          alert(data.message || 'Login failed');
        }
      } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login');
      }
    }
  }
};
</script>