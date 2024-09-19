<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">Register</h2>
    <form @submit.prevent="register" class="border p-4 rounded shadow-sm bg-light">
      <!-- Existing fields -->
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
      
      <!-- New fields -->
      <div class="mb-3">
        <label for="nationality" class="form-label">Nationality:</label>
        <select id="nationality" v-model="nationality" class="form-select" required>
          <option v-for="country in countries" :key="country.code" :value="country.code">
            {{ country.flag }} {{ country.name }}
          </option>
        </select>
      </div>
      
      <div class="mb-3">
        <label class="form-label">Known Languages:</label>
        <div v-for="(lang, index) in knownLanguages" :key="index" class="d-flex mb-2">
          <select v-model="lang.language" class="form-select me-2">
            <option v-for="language in languages" :key="language" :value="language">
              {{ language }}
            </option>
          </select>
          <select v-model="lang.level" class="form-select">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="fluent">Fluent</option>
          </select>
          <button @click.prevent="removeKnownLanguage(index)" class="btn btn-danger ms-2">Remove</button>
        </div>
        <button @click.prevent="addKnownLanguage" class="btn btn-secondary">Add Known Language</button>
      </div>
      
      <div class="mb-3">
        <label class="form-label">Learning Languages:</label>
        <div v-for="(lang, index) in learningLanguages" :key="index" class="d-flex mb-2">
          <select v-model="learningLanguages[index]" class="form-select">
            <option v-for="language in languages" :key="language" :value="language">
              {{ language }}
            </option>
          </select>
          <button @click.prevent="removeLearningLanguage(index)" class="btn btn-danger ms-2">Remove</button>
        </div>
        <button @click.prevent="addLearningLanguage" class="btn btn-secondary">Add Learning Language</button>
      </div>
      
      <button type="submit" class="btn btn-primary w-100">Register</button>
    </form>
  </div>
</template>

<script>
import { eventBus } from '../eventBus';

export default {
  name: 'UserRegister',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      nationality: '',
      knownLanguages: [{ language: '', level: 'beginner' }],
      learningLanguages: [''],
      countries: [
        { code: 'FR', name: 'France', flag: '🇫🇷' },
        { code: 'US', name: 'United States', flag: '🇺🇸' },
        { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
        { code: 'DE', name: 'Germany', flag: '🇩🇪' },
        { code: 'ES', name: 'Spain', flag: '🇪🇸' },
        { code: 'IT', name: 'Italy', flag: '🇮🇹' },
        { code: 'JP', name: 'Japan', flag: '🇯🇵' },
        { code: 'CN', name: 'China', flag: '🇨🇳' },
        { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
        { code: 'IN', name: 'India', flag: '🇮🇳' },
      ],
      languages: [
        'English', 'French', 'Spanish', 'German', 'Italian', 'Chinese', 'Japanese',
        'Portuguese', 'Russian', 'Arabic', 'Hindi', 'Korean', 'Dutch', 'Swedish',
        'Greek', 'Turkish', 'Polish', 'Vietnamese', 'Thai', 'Indonesian'
      ]
    };
  },
  methods: {
    addKnownLanguage() {
      this.knownLanguages.push({ language: '', level: 'beginner' });
    },
    removeKnownLanguage(index) {
      this.knownLanguages.splice(index, 1);
    },
    addLearningLanguage() {
      this.learningLanguages.push('');
    },
    removeLearningLanguage(index) {
      this.learningLanguages.splice(index, 1);
    },
    async register() {
      try {
        const registerResponse = await fetch('http://localhost:5000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.username,
            email: this.email,
            password: this.password,
            nationality: this.nationality,
            knownLanguages: this.knownLanguages.filter(lang => lang.language !== ''),
            learningLanguages: this.learningLanguages.filter(lang => lang !== '')
          })
        });
        const data = await registerResponse.json();
        if (registerResponse.ok) {
          // Connexion automatique après l'inscription
          const loginResponse = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: this.email,
              password: this.password
            })
          });
          if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            localStorage.setItem('token', loginData.token);
            localStorage.setItem('username', loginData.username);
            localStorage.setItem('userId', loginData.userId);
            localStorage.setItem('userIcon', loginData.icon);
            eventBus.emit('login');
            this.$router.push('/');
          } else {
            throw new Error('Auto-login failed after registration');
          }
        } else {
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