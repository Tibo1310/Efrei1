<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">Mon Profil</h2>
    <div v-if="isLoading">Chargement...</div>
    <div v-else class="border p-4 rounded shadow-sm bg-light">
      <div class="mb-3 d-flex align-items-center">
        <div class="flex-grow-1 me-2">
          <label for="username" class="form-label">Username:</label>
          <input type="text" id="username" v-model="username" class="form-control" required>
        </div>
        <button @click="updateField('username')" class="btn btn-outline-primary"><i class="fas fa-sync-alt"></i></button>
      </div>
      <div class="mb-3 d-flex align-items-center">
        <div class="flex-grow-1 me-2">
          <label for="email" class="form-label">Email:</label>
          <input type="email" id="email" v-model="email" class="form-control" required>
        </div>
        <button @click="updateField('email')" class="btn btn-outline-primary"><i class="fas fa-sync-alt"></i></button>
      </div>
      <div class="mb-3 d-flex align-items-center">
        <div class="flex-grow-1 me-2">
          <label for="password" class="form-label">Password:</label>
          <input type="password" id="password" v-model="password" class="form-control" placeholder="Enter new password">
        </div>
        <button @click="updateField('password')" class="btn btn-outline-primary"><i class="fas fa-sync-alt"></i></button>
      </div>
      <div class="mb-3 d-flex align-items-center">
        <div class="flex-grow-1 me-2">
          <label for="nationality" class="form-label">Nationality:</label>
          <select id="nationality" v-model="nationality" class="form-select" required>
            <option v-for="country in countries" :key="country.code" :value="country.code">
              {{ country.flag }} {{ country.name }}
            </option>
          </select>
        </div>
        <button @click="updateField('nationality')" class="btn btn-outline-primary"><i class="fas fa-sync-alt"></i></button>
      </div>
      <div class="mb-3">
        <label class="form-label">Known Languages:</label>
        <div v-for="(lang, index) in knownLanguages" :key="index" class="d-flex align-items-center mb-2">
          <div>{{ lang.language }} - {{ lang.level }}</div>
          <button @click="removeKnownLanguage(index)" class="btn btn-outline-danger ms-2"><i class="fas fa-trash"></i></button>
          <button @click="updateKnownLanguage(index)" class="btn btn-outline-primary ms-2"><i class="fas fa-sync-alt"></i></button>
        </div>
        <div class="d-flex mb-2">
          <select v-model="newKnownLanguage.language" class="form-select me-2">
            <option v-for="language in languages" :key="language" :value="language">
              {{ language }}
            </option>
          </select>
          <select v-model="newKnownLanguage.level" class="form-select me-2">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="fluent">Fluent</option>
          </select>
          <button @click="addKnownLanguage" class="btn btn-secondary">Add</button>
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label">Learning Languages:</label>
        <div v-for="(lang, index) in learningLanguages" :key="index" class="d-flex align-items-center mb-2">
          <div>{{ lang }}</div>
          <button @click="removeLearningLanguage(index)" class="btn btn-outline-danger ms-2"><i class="fas fa-trash"></i></button>
          <button @click="updateLearningLanguage(index)" class="btn btn-outline-primary ms-2"><i class="fas fa-sync-alt"></i></button>
        </div>
        <div class="d-flex mb-2">
          <select v-model="newLearningLanguage" class="form-select me-2">
            <option v-for="language in languages" :key="language" :value="language">
              {{ language }}
            </option>
          </select>
          <button @click="addLearningLanguage" class="btn btn-secondary">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'UserProfile',
  data() {
    return {
      isLoading: true,
      username: '',
      email: '',
      password: '',
      nationality: '',
      knownLanguages: [],
      learningLanguages: [],
      newKnownLanguage: { language: '', level: 'beginner' },
      newLearningLanguage: '',
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
  computed: {
    ...mapState(['user'])
  },
  async created() {
    await this.initializeUserData();
  },
  methods: {
    ...mapActions(['updateProfile', 'fetchUserProfile']),
    async initializeUserData() {
      this.isLoading = true;
      await this.fetchUserProfile();
      this.updateLocalData();
      this.isLoading = false;
    },
    updateLocalData() {
      if (this.user) {
        this.username = this.user.username || '';
        this.email = this.user.email || '';
        this.nationality = this.user.nationality || '';
        this.knownLanguages = this.user.knownLanguages || [];
        this.learningLanguages = this.user.learningLanguages || [];
      }
    },
    async updateField(field) {
      const result = await this.updateProfile({ [field]: this[field] });
      if (result.success) {
        alert(`${field} updated successfully`);
      } else {
        alert(result.message);
      }
    },
    async addKnownLanguage() {
      if (this.newKnownLanguage.language) {
        const updatedKnownLanguages = [...this.knownLanguages, { ...this.newKnownLanguage }];
        const result = await this.updateProfile({ knownLanguages: updatedKnownLanguages });
        if (result.success) {
          this.knownLanguages = updatedKnownLanguages;
          this.newKnownLanguage = { language: '', level: 'beginner' };
          alert('Known language added successfully');
        } else {
          alert(result.message);
        }
      }
    },
    async removeKnownLanguage(index) {
      const updatedKnownLanguages = this.knownLanguages.filter((_, i) => i !== index);
      const result = await this.updateProfile({ knownLanguages: updatedKnownLanguages });
      if (result.success) {
        this.knownLanguages = updatedKnownLanguages;
        alert('Known language removed successfully');
      } else {
        alert(result.message);
      }
    },
    async updateKnownLanguage(index) {
      const result = await this.updateProfile({ knownLanguages: this.knownLanguages });
      if (result.success) {
        alert('Known language updated successfully');
      } else {
        alert(result.message);
      }
    },
    async addLearningLanguage() {
      if (this.newLearningLanguage) {
        const updatedLearningLanguages = [...this.learningLanguages, this.newLearningLanguage];
        const result = await this.updateProfile({ learningLanguages: updatedLearningLanguages });
        if (result.success) {
          this.learningLanguages = updatedLearningLanguages;
          this.newLearningLanguage = '';
          alert('Learning language added successfully');
        } else {
          alert(result.message);
        }
      }
    },
    async removeLearningLanguage(index) {
      const updatedLearningLanguages = this.learningLanguages.filter((_, i) => i !== index);
      const result = await this.updateProfile({ learningLanguages: updatedLearningLanguages });
      if (result.success) {
        this.learningLanguages = updatedLearningLanguages;
        alert('Learning language removed successfully');
      } else {
        alert(result.message);
      }
    },
    async updateLearningLanguage(index) {
      const result = await this.updateProfile({ learningLanguages: this.learningLanguages });
      if (result.success) {
        alert('Learning language updated successfully');
      } else {
        alert(result.message);
      }
    }
  }
};
</script>