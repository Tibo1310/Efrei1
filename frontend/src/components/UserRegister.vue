<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">Register</h2>
    <form @submit.prevent="handleRegister" class="border p-4 rounded shadow-sm bg-light">
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
          <select v-model="lang.language" class="form-select me-2" @change="updateAvailableLanguages">
            <option value="">Select a language</option>
            <option v-for="language in getAvailableKnownLanguages(index)" :key="language" :value="language">
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
        <button @click.prevent="addKnownLanguage" class="btn btn-secondary" :disabled="knownLanguages.length >= 5 || getAvailableKnownLanguages().length === 0">Add Known Language</button>
      </div>
      
      <div class="mb-3">
        <label class="form-label">Learning Languages:</label>
        <div v-for="(lang, index) in learningLanguages" :key="index" class="d-flex mb-2">
          <select v-model="learningLanguages[index]" class="form-select" @change="updateAvailableLanguages">
            <option value="">Select a language</option>
            <option v-for="language in getAvailableLearningLanguages(index)" :key="language" :value="language">
              {{ language }}
            </option>
          </select>
          <button @click.prevent="removeLearningLanguage(index)" class="btn btn-danger ms-2">Remove</button>
        </div>
        <button @click.prevent="addLearningLanguage" class="btn btn-secondary" :disabled="learningLanguages.length >= 3 || getAvailableLearningLanguages().length === 0">Add Learning Language</button>
      </div>
      
      <button type="submit" class="btn btn-primary w-100">Register</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

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
      allLanguages: [
        'English', 'French', 'Spanish', 'German', 'Italian', 'Chinese', 'Japanese',
        'Portuguese', 'Russian', 'Arabic', 'Hindi', 'Korean', 'Dutch', 'Swedish',
        'Greek', 'Turkish', 'Polish', 'Vietnamese', 'Thai', 'Indonesian'
      ]
    };
  },
  methods: {
    ...mapActions(['register']),
    updateAvailableLanguages() {
    },
    getAvailableKnownLanguages(currentIndex) {
      const usedLanguages = new Set(
        this.knownLanguages
          .filter((lang, index) => index !== currentIndex && lang.language !== '')
          .map(lang => lang.language)
          .concat(this.learningLanguages.filter(lang => lang !== ''))
      );
      return this.allLanguages.filter(lang => !usedLanguages.has(lang));
    },
    getAvailableLearningLanguages(currentIndex) {
      const usedLanguages = new Set(
        this.learningLanguages
          .filter((lang, index) => index !== currentIndex && lang !== '')
          .concat(this.knownLanguages.filter(lang => lang.language !== '').map(lang => lang.language))
      );
      return this.allLanguages.filter(lang => !usedLanguages.has(lang));
    },
    addKnownLanguage() {
      if (this.knownLanguages.length < 5 && this.getAvailableKnownLanguages().length > 0) {
        this.knownLanguages.push({ language: '', level: 'beginner' });
      }
    },
    removeKnownLanguage(index) {
      this.knownLanguages.splice(index, 1);
    },
    addLearningLanguage() {
      if (this.learningLanguages.length < 3 && this.getAvailableLearningLanguages().length > 0) {
        this.learningLanguages.push('');
      }
    },
    removeLearningLanguage(index) {
      this.learningLanguages.splice(index, 1);
    },
    async handleRegister() {
      const userData = {
        username: this.username,
        email: this.email,
        password: this.password,
        nationality: this.nationality,
        knownLanguages: this.knownLanguages.filter(lang => lang.language !== ''),
        learningLanguages: this.learningLanguages.filter(lang => lang !== '')
      };
      
      console.log('User data being sent:', userData);
      
      const result = await this.register(userData);
      if (result.success) {
        this.$router.push('/');
      } else {
        alert(result.message);
      }
    }
  }
};
</script>