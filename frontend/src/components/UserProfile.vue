<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">Mon Profil</h2>
    <div v-if="isLoading">Chargement...</div>
    <div v-else class="border p-4 rounded shadow-sm bg-light">
      <div class="mb-3">
        <strong>Username:</strong> {{ user.username }}
      </div>
      <div class="mb-3">
        <strong>Email:</strong> {{ user.email }}
      </div>
      <div class="mb-3">
        <strong>Nationality:</strong> {{ user.nationality }}
      </div>
      <div class="mb-3">
        <strong>Known Languages:</strong>
        <ul>
          <li v-for="lang in user.knownLanguages" :key="lang.language">
            {{ lang.language }} - {{ lang.level }}
          </li>
        </ul>
      </div>
      <div class="mb-3">
        <strong>Learning Languages:</strong>
        <ul>
          <li v-for="lang in user.learningLanguages" :key="lang">
            {{ lang }}
          </li>
        </ul>
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
      isLoading: true
    };
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    ...mapActions(['fetchUserProfile'])
  },
  async created() {
    console.log('UserProfile component created');
    try {
      await this.fetchUserProfile();
      console.log('User profile after fetch:', this.user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      this.isLoading = false;
    }
  }
};
</script>