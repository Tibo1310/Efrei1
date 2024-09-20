<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">Mes Activités</h2>
    <div class="btn-group w-100 mb-4" role="group">
      <button @click="currentTab = 'like'" :class="['btn', currentTab === 'like' ? 'btn-primary' : 'btn-outline-primary']">Likes</button>
      <button @click="currentTab = 'comment'" :class="['btn', currentTab === 'comment' ? 'btn-primary' : 'btn-outline-primary']">Commentaires</button>
      <button @click="currentTab = 'repost'" :class="['btn', currentTab === 'repost' ? 'btn-primary' : 'btn-outline-primary']">Republications</button>
      <button @click="currentTab = 'share'" :class="['btn', currentTab === 'share' ? 'btn-primary' : 'btn-outline-primary']">Partages</button>
    </div>
    <div v-if="isLoading">Chargement des activités...</div>
    <div v-else-if="!userActivities || userActivities.length === 0" class="text-center">
      <p>Aucune activité trouvée.</p>
    </div>
    <div v-else-if="filteredActivities.length === 0" class="text-center">
      <p>Aucune activité dans cette catégorie.</p>
    </div>
    <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div v-for="activity in filteredActivities" :key="activity._id" class="col">
        <div class="card h-100 shadow-sm">
          <div class="card-header">
            <strong>{{ activity.type }}</strong> - {{ new Date(activity.date).toLocaleString() }}
          </div>
          <div class="card-body" v-if="activity.postId">
            <h5 class="card-title">{{ activity.postId.name }}</h5>
            <p class="card-text">{{ activity.postId.description }}</p>
            <div v-if="activity.type === 'comment'" class="mt-2">
              <strong>Votre commentaire:</strong> {{ activity.comment }}
            </div>
          </div>
          <div class="card-body" v-else>
            <p>Détails du post non disponibles</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'UserActivity',
  data() {
    return {
      currentTab: 'like',
      isLoading: true
    };
  },
  computed: {
    ...mapState(['userActivities', 'user']),
    filteredActivities() {
      console.log('All activities:', this.userActivities);
      const filtered = this.userActivities.filter(activity => activity.type === this.currentTab);
      console.log('Filtered activities:', filtered);
      return filtered;
    }
  },
  methods: {
    ...mapActions(['fetchUserActivities'])
  },
  async created() {
    console.log('UserActivity component created');
    if (this.user && this.user.userId) {
      try {
        console.log('Fetching activities for user:', this.user.userId);
        await this.fetchUserActivities();
        console.log('Activities after fetch:', this.userActivities);
      } catch (error) {
        console.error('Error fetching user activities:', error);
      } finally {
        this.isLoading = false;
      }
    } else {
      console.error('User not logged in');
      this.isLoading = false;
    }
  },
  watch: {
    userActivities: {
      handler(newActivities) {
        console.log('userActivities updated:', newActivities);
      },
      deep: true
    }
  }
};
</script>