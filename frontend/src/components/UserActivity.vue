<template>
  <div class="container mt-5">
    <div class="btn-group w-100 mb-4" role="group">
      <button @click="currentTab = 'like'" :class="['btn', currentTab === 'like' ? 'btn-primary' : 'btn-outline-primary']">Likes</button>
      <button @click="currentTab = 'comment'" :class="['btn', currentTab === 'comment' ? 'btn-primary' : 'btn-outline-primary']">Commentaires</button>
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
          <div class="activity-banner" :class="activity.type">
            {{ getActivityText(activity) }} on {{ formatDate(activity.date) }} at {{ formatTime(activity.date) }}
          </div>
          <div class="card-header d-flex align-items-center">
            <img v-if="activity.postId.author && activity.postId.author.icon && activity.postId.author.icon.startsWith('/uploads/')" :src="`http://localhost:5000${activity.postId.author.icon}`" class="user-icon me-2" />
            <i v-else :class="[activity.postId.author ? activity.postId.author.icon : 'fas fa-user-circle', 'user-icon', 'me-2', 'basic-icon']"></i>
            <div>
              <div class="username">{{ activity.postId.author ? activity.postId.author.username : 'Unknown' }}</div>
              <div class="followers">{{ activity.postId.author ? activity.postId.author.followers || 0 : 0 }} abonnés</div>
              <div class="post-date">{{ formatDate(activity.postId.dateCreated) }}</div>
            </div>
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ activity.postId.name }}</h5>
            <p class="card-text flex-grow-1">{{ activity.postId.description }}</p>
            <div v-if="activity.postId.mediaUrl" class="card-img-wrapper">
              <img :src="`http://localhost:5000${activity.postId.mediaUrl}`" class="card-img" alt="Post media">
            </div>
            <div class="card-footer d-flex justify-content-between">
              <span>{{ activity.postId.comments ? activity.postId.comments.length : 0 }} commentaires</span>
              <span>{{ activity.postId.likes ? activity.postId.likes.length : 0 }} likes</span>
            </div>
            <div v-if="activity.type === 'comment'" class="mt-2">
              <strong>Votre commentaire:</strong> {{ activity.comment }}
            </div>
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
    ...mapActions(['fetchUserActivities']),
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    formatTime(date) {
      return new Date(date).toLocaleTimeString();
    },
    getActivityText(activity) {
      switch(activity.type) {
        case 'like':
          return 'Liked';
        case 'comment':
          return 'Commented';
        case 'repost':
          return 'Reposted';
        case 'share':
          return 'Shared';
        default:
          return 'Interacted with';
      }
    }
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

<style scoped>
.activity-banner {
  background-color: #007bff;
  color: white;
  padding: 5px 10px;
  font-size: 0.9rem;
  text-align: center;
}

.activity-banner.like {
  background-color: #28a745;
}

.activity-banner.comment {
  background-color: #ffc107;
  color: #212529;
}

.activity-banner.repost {
  background-color: #17a2b8;
}

.activity-banner.share {
  background-color: #6c757d;
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 10px;
}

.user-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.basic-icon {
  font-size: 40px;
  line-height: 40px;
}

.username {
  font-weight: bold;
}

.followers, .post-date {
  font-size: 0.9rem;
  color: #6c757d;
}

.card-img-wrapper {
  margin-top: 10px;
}

.card-img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.card-footer {
  font-size: 0.9rem;
  color: #6c757d;
  border-top: 1px solid #e9ecef;
  padding-top: 10px;
}
</style>