<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">Home Page</h2>
    <div v-if="posts.length === 0" class="text-center">
      <p>No posts yet. Be the first to create a post!</p>
    </div>
    <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div v-for="post in posts" :key="post._id" class="col">
        <div class="card h-100 shadow-sm">
          <div class="card-img-top-wrapper">
            <img v-if="post.mediaUrl" :src="`http://localhost:5000${post.mediaUrl}`" class="card-img-top" alt="Post media">
            <div v-else class="card-img-placeholder"></div>
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ post.name }}</h5>
            <p class="card-text flex-grow-1">{{ post.description }}</p>
            <p class="card-text mt-auto"><small class="text-muted">Posted by {{ post.author.username }}</small></p>
          </div>
        </div>
      </div>
    </div>
    <FloatingActionButton v-if="isLoggedIn" @click="showModal = true" />
    <CreatePostModal v-if="showModal" @close="showModal = false" @post-created="handlePostCreated" />
  </div>
</template>

<script>
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
      posts: [],
      showModal: false,
      isLoggedIn: false
    }
  },
  created() {
    this.checkLoginStatus();
    this.fetchPosts();
  },
  methods: {
    checkLoginStatus() {
      this.isLoggedIn = !!localStorage.getItem('token');
    },
    async fetchPosts() {
      try {
        const response = await fetch('http://localhost:5000/posts');
        if (response.ok) {
          this.posts = await response.json();
        } else {
          console.error('Failed to fetch posts');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    },
    handlePostCreated() {
      this.showModal = false;
      this.fetchPosts();
    }
  }
}
</script>

<style scoped>
.card-img-top-wrapper {
  height: 200px;
  overflow: hidden;
}

.card-img-top {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-img-placeholder {
  width: 100%;
  height: 100%;
  background-color: #f8f9fa;
}

.card-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
}

.card-text {
  font-family: 'Roboto', sans-serif;
}
</style>