<template>
  <div class="container mt-5">
    <div class="btn-group w-100 mb-4" role="group">
      <button @click="currentTab = 'like'" :class="['btn', currentTab === 'like' ? 'btn-dark' : 'btn-outline-dark']">Likes</button>
      <button @click="currentTab = 'comment'" :class="['btn', currentTab === 'comment' ? 'btn-dark' : 'btn-outline-dark']">Commentaires</button>
      <button @click="currentTab = 'share'" :class="['btn', currentTab === 'share' ? 'btn-dark' : 'btn-outline-dark']">Partages</button>
      <button @click="currentTab = 'followers'" :class="['btn', currentTab === 'followers' ? 'btn-dark' : 'btn-outline-dark']">Abonnés</button>
      <button @click="currentTab = 'following'" :class="['btn', currentTab === 'following' ? 'btn-dark' : 'btn-outline-dark']">Abonnements</button>
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
        <div class="card h-100 shadow-sm border-dark">
          <div class="activity-banner" :class="activity.type">
            {{ getActivityText(activity) }} on {{ formatDate(activity.date) }} at {{ formatTime(activity.date) }}
          </div>
          <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
              <img v-if="activity.postId.author && activity.postId.author.icon && activity.postId.author.icon.startsWith('/uploads/')" :src="`http://localhost:5000${activity.postId.author.icon}`" class="user-icon me-2" />
              <i v-else :class="[activity.postId.author ? activity.postId.author.icon : 'fas fa-user-circle', 'user-icon', 'me-2', 'basic-icon']"></i>
              <div>
                <div class="username">{{ activity.postId.author ? activity.postId.author.username : 'Unknown' }}</div>
                <div class="followers small">{{ activity.postId.author ? activity.postId.author.followers || 0 : 0 }} abonnés</div>
              </div>
            </div>
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ activity.postId.name }}</h5>
            <p class="card-text flex-grow-1">{{ activity.postId.description }}</p>
            <div v-if="activity.postId.mediaUrl" class="card-img-wrapper mb-3">
              <img :src="`http://localhost:5000${activity.postId.mediaUrl}`" class="card-img rounded" alt="Post media">
            </div>
            <div v-if="currentTab === 'comment'" class="mt-2">
              <strong>Votre commentaire:</strong> {{ activity.comment }}
            </div>
          </div>
          <div class="card-footer bg-light d-flex justify-content-between align-items-center">
            <div class="post-date small text-muted">{{ formatDate(activity.postId.dateCreated) }}</div>
            <div class="card-actions d-flex">
              <div v-if="currentTab === 'like'" class="action" @click="toggleLike(activity)">
                <i class="fas fa-thumbs-up text-primary"></i>
                <span class="ms-1">{{ activity.postId.likes ? activity.postId.likes.length : 0 }}</span>
              </div>
              <div v-if="currentTab === 'comment'" class="action">
                <i class="fas fa-comment"></i>
                <span class="ms-1">{{ activity.postId.comments ? activity.postId.comments.length : 0 }}</span>
              </div>
              <div v-if="currentTab === 'share'" class="action" @click="toggleShare(activity)">
                <i class="fas fa-share text-primary"></i>
                <span class="ms-1">{{ activity.postId.shares || 0 }}</span>
              </div>
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
      isLoading: true,
      localActivities: []
    };
  },
  computed: {
    ...mapState(['userActivities', 'user']),
    filteredActivities() {
      return this.localActivities.filter(activity => activity.type === this.currentTab);
    }
  },
  methods: {
    ...mapActions(['fetchUserActivities', 'likePost', 'sharePost', 'fetchUserProfile']),
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
        case 'share':
          return 'Shared';
        default:
          return 'Interacted with';
      }
    },
    async toggleLike(activity) {
      try {
        const result = await this.likePost(activity.postId._id);
        if (result.success) {
          // Supprimer l'activité de la liste locale
          this.localActivities = this.localActivities.filter(a => a._id !== activity._id);
        }
      } catch (error) {
        console.error('Error toggling like:', error);
      }
    },
    async toggleShare(activity) {
      try {
        const result = await this.sharePost(activity.postId._id);
        if (result.success) {
          // Supprimer l'activité de la liste locale
          this.localActivities = this.localActivities.filter(a => a._id !== activity._id);
        }
      } catch (error) {
        console.error('Error toggling share:', error);
      }
    }
  },
  async created() {
    if (this.user && this.user.userId) {
      try {
        await this.fetchUserActivities();
        await this.fetchUserProfile(); // get abonnés et abonnements
        this.localActivities = [...this.userActivities];
      } catch (error) {
        console.error('Error fetching user data:', error);
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
        this.localActivities = [...newActivities];
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

.activity-banner.share {
  background-color: #17a2b8;
}

.card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border-width: 2px;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.card-header {
  border-bottom: none;
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

.card-img-wrapper {
  overflow: hidden;
  border-radius: 8px;
}

.card-img {
  transition: transform 0.3s ease-in-out;
}

.card-img:hover {
  transform: scale(1.05);
}

.card-footer {
  border-top: 1px solid rgba(0,0,0,0.125);
}

.action {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: color 0.2s ease-in-out;
}

.action:hover {
  color: #007bff;
}

.action i {
  font-size: 1.1rem;
}

.action span {
  font-size: 0.9rem;
}

.btn-group {
  margin-bottom: 20px;
}

.btn-group .btn {
  border-color: #000;
}

.btn-group .btn:not(:last-child) {
  border-right: none;
}

.btn-group .btn.btn-dark {
  background-color: #000;
  color: white;
}

.btn-group .btn.btn-outline-dark {
  color: #000;
  background-color: white;
}

.btn-group .btn.btn-outline-dark:hover {
  background-color: #000;
  color: white;
}

.user-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.btn-group .btn {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .btn-group {
    flex-wrap: wrap;
  }
  .btn-group .btn {
    flex-basis: 33.33%;
  }
}
</style>