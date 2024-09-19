<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">Home Page</h2>
    <div v-if="posts.length === 0" class="text-center">
      <p>No posts yet. Be the first to create a post!</p>
    </div>
    <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div v-for="post in posts" :key="post._id" class="col">
        <div class="card h-100 shadow-sm">
          <div class="card-header d-flex align-items-center">
            <img v-if="post.author && post.author.icon && post.author.icon.startsWith('/uploads/')" :src="`http://localhost:5000${post.author.icon}`" class="user-icon me-2" />
            <i v-else :class="post.author ? post.author.icon : 'fas fa-user-circle'" class="user-icon me-2"></i>
            <div>
              <div class="username">{{ post.author ? post.author.username : 'Unknown' }}</div>
              <div class="followers">{{ post.author ? post.author.followers || 0 : 0 }} abonnés</div>
              <div class="post-date">{{ new Date(post.dateCreated).toLocaleDateString() }}</div>
            </div>
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ post.name }}</h5>
            <p class="card-text flex-grow-1">{{ post.description }}</p>
            <div v-if="post.mediaUrl" class="card-img-wrapper">
              <img :src="`http://localhost:5000${post.mediaUrl}`" class="card-img" alt="Post media">
            </div>
            <div class="card-footer d-flex justify-content-between">
              <span>{{ post.comments ? post.comments.length : 0 }} commentaires</span>
              <span>{{ post.likes ? post.likes.length : 0 }} likes</span>
            </div>
            <div class="card-actions d-flex justify-content-between mt-2">
              <div class="action">
                <i class="fas fa-thumbs-up"></i>
                <span>J'aime</span>
              </div>
              <div class="action">
                <i class="fas fa-comment"></i>
                <span>Commenter</span>
              </div>
              <div class="action">
                <i class="fas fa-retweet"></i>
                <span>Republier</span>
              </div>
              <div class="action">
                <i class="fas fa-share"></i>
                <span>Partager</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FloatingActionButton v-if="isLoggedIn" @click="showModal = true" />
    <CreatePostModal v-if="showModal" @close="showModal = false" @post-created="handlePostCreated" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import FloatingActionButton from './FloatingActionButton.vue';
import CreatePostModal from './CreatePostModal.vue';

export default {
  name: 'HomePage',
  components: {
    FloatingActionButton,
    CreatePostModal
  },
  data() {
    return {
      showModal: false
    }
  },
  computed: {
    ...mapState(['posts', 'isLoggedIn'])
  },
  created() {
    this.fetchPosts();
  },
  methods: {
    ...mapActions(['fetchPosts']),
    handlePostCreated() {
      this.showModal = false;
      this.fetchPosts();
    }
  }
}
</script>

<style scoped>
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

.card-actions {
  border-top: 1px solid #e9ecef;
  padding-top: 10px;
}

.action {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.action i {
  font-size: 1.2rem;
  color: #007bff;
}

.action span {
  font-size: 0.9rem;
  color: #007bff;
}
</style>