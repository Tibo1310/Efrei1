<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">Mon Profil</h2>
    <div v-if="isLoading">Chargement...</div>
    <div v-else-if="!user">
      <p class="text-center">Veuillez vous connecter pour voir votre profil.</p>
    </div>
    <div v-else class="border p-4 rounded shadow-sm bg-light">
      <div class="mb-3">
        <strong>Username:</strong>
        <span v-if="!isEditing">{{ user.username }}</span>
        <input v-else type="text" v-model="editedUser.username" class="form-control">
      </div>
      <div class="mb-3">
        <strong>Email:</strong>
        <span v-if="!isEditing">{{ user.email }}</span>
        <input v-else type="email" v-model="editedUser.email" class="form-control">
      </div>
      <div class="mb-3">
        <strong>Nationality:</strong>
        <span v-if="!isEditing">{{ user.nationality }}</span>
        <select v-else v-model="editedUser.nationality" class="form-select">
          <option v-for="country in countries" :key="country.code" :value="country.code">
            {{ country.flag }} {{ country.name }}
          </option>
        </select>
      </div>
      <div class="mb-3">
        <strong>Known Languages:</strong>
        <ul v-if="!isEditing">
          <li v-for="lang in user.knownLanguages" :key="lang.language">
            {{ lang.language }} - {{ lang.level }}
          </li>
        </ul>
        <div v-else>
          <div v-for="(lang, index) in editedUser.knownLanguages" :key="index" class="mb-2">
            <select v-model="lang.language" class="form-select me-2 d-inline-block w-auto">
              <option v-for="language in availableLanguages" :key="language" :value="language">
                {{ language }}
              </option>
            </select>
            <select v-model="lang.level" class="form-select me-2 d-inline-block w-auto">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="fluent">Fluent</option>
            </select>
            <button @click="removeKnownLanguage(index)" class="btn btn-danger btn-sm">Remove</button>
          </div>
          <button @click="addKnownLanguage" class="btn btn-secondary btn-sm mt-2" :disabled="editedUser.knownLanguages.length >= 5">Add Known Language</button>
        </div>
      </div>
      <div class="mb-3">
        <strong>Learning Languages:</strong>
        <ul v-if="!isEditing">
          <li v-for="lang in user.learningLanguages" :key="lang">
            {{ lang }}
          </li>
        </ul>
        <div v-else>
          <div v-for="(lang, index) in editedUser.learningLanguages" :key="index" class="mb-2">
            <select v-model="editedUser.learningLanguages[index]" class="form-select me-2 d-inline-block w-auto">
              <option v-for="language in availableLanguages" :key="language" :value="language">
                {{ language }}
              </option>
            </select>
            <button @click="removeLearningLanguage(index)" class="btn btn-danger btn-sm">Remove</button>
          </div>
          <button @click="addLearningLanguage" class="btn btn-secondary btn-sm mt-2" :disabled="editedUser.learningLanguages.length >= 3">Add Learning Language</button>
        </div>
      </div>
      <div class="mb-3">
        <strong>Password:</strong>
        <input v-if="isEditing" type="password" v-model="editedUser.password" class="form-control" placeholder="Enter new password">
      </div>
      <button v-if="!isEditing" @click="startEditing" class="btn btn-primary">Modifier</button>
      <button v-else @click="saveChanges" class="btn btn-success">Valider</button>
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
      isEditing: false,
      editedUser: {},
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
      availableLanguages: [
        'English', 'French', 'Spanish', 'German', 'Italian', 'Chinese', 'Japanese',
        'Portuguese', 'Russian', 'Arabic', 'Hindi', 'Korean', 'Dutch', 'Swedish',
        'Greek', 'Turkish', 'Polish', 'Vietnamese', 'Thai', 'Indonesian'
      ]
    };
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    ...mapActions(['fetchUserProfile', 'updateUserProfile']),
    startEditing() {
      this.editedUser = JSON.parse(JSON.stringify(this.user));
      this.isEditing = true;
    },
    async saveChanges() {
      try {
        const updatedProfile = { ...this.editedUser };
        // Envoyer le mot de passe seulement s'il a été modifié
        if (updatedProfile.password && updatedProfile.password.trim() !== '') {
          updatedProfile.password = updatedProfile.password.trim();
        } else {
          delete updatedProfile.password;
        }
        const result = await this.updateUserProfile(updatedProfile);
        if (result.success) {
          this.isEditing = false;
          await this.fetchUserProfile();
          alert('Profile updated successfully. If you changed your password, please log out and log in again with your new password.');
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
      }
    },
    addKnownLanguage() {
      if (this.editedUser.knownLanguages.length < 5) {
        const newLanguage = this.availableLanguages.find(lang => 
          !this.editedUser.knownLanguages.some(known => known.language === lang) &&
          !this.editedUser.learningLanguages.includes(lang)
        );
        if (newLanguage) {
          this.editedUser.knownLanguages.push({ language: newLanguage, level: 'beginner' });
        }
      }
    },
    removeKnownLanguage(index) {
      this.editedUser.knownLanguages.splice(index, 1);
    },
    addLearningLanguage() {
      if (this.editedUser.learningLanguages.length < 3) {
        const newLanguage = this.availableLanguages.find(lang => 
          !this.editedUser.learningLanguages.includes(lang) &&
          !this.editedUser.knownLanguages.some(known => known.language === lang)
        );
        if (newLanguage) {
          this.editedUser.learningLanguages.push(newLanguage);
        }
      }
    },
    removeLearningLanguage(index) {
      this.editedUser.learningLanguages.splice(index, 1);
    }
  },
  async created() {
    console.log('UserProfile component created');
    try {
      if (this.$store.getters.isLoggedIn) {
        await this.fetchUserProfile();
        console.log('User profile after fetch:', this.user);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      this.isLoading = false;
    }
  },
  watch: {
    '$store.state.isLoggedIn': {
      immediate: true,
      handler(newValue) {
        if (!newValue) {
          this.$router.push('/login');
        }
      }
    }
  }
};
</script>