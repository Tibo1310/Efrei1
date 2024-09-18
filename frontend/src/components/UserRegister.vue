<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">Register</h2>
    <form @submit.prevent="register" class="border p-4 rounded shadow-sm bg-light">
      <div class="mb-3">
        <label for="username" class="form-label">Username:</label>
        <input type="text" id="username" v-model="username" class="form-control" required>
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email:</label>
        <input type="email" id="email" v-model="email" class="form-control" required>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password:</label>
        <input type="password" id="password" v-model="password" class="form-control" required>
      </div>
      <button type="submit" class="btn btn-primary w-100">Register</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'UserRegister',
  data() {
    return {
      username: '',
      email: '',
      password: ''
    };
  },
  methods: {
    async register() {
      try {
        const response = await fetch('http://localhost:5000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.username,
            email: this.email,
            password: this.password
          })
        });
        if (response.ok) {
          alert('Registration successful');
          this.$router.push('/login');
        } else {
          const data = await response.json();
          alert(data.message || 'Registration failed');
        }
      } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred during registration');
      }
    }
  }
};
</script>