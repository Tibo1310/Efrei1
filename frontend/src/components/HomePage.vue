<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">Home Page</h2>
    <div v-if="posts.length === 0" class="text-center">
      <p>No posts yet. Be the first to create a post!</p>
    </div>
    <div v-else class="row">
      <div v-for="post in posts" :key="post._id" class="col-md-4 mb-4">
        <div class="card">
          <img v-if="post.mediaUrl" :src="post.mediaUrl" class="card-img-top" alt="Post media">
          <div class="card-body">
            <h5 class="card-title">{{ post.title }}</h5>
            <p class="card-text">{{ post.description }}</p>
            <p class="card-text"><small class="text-muted">Posted by {{ post.author.username }}</small></p>
          </div>
        </div>
      </div>
    </div>
    <FloatingActionButton v-if="isLoggedIn" @click="showModal = true" />
    <CreatePostModal v-if="showModal" @close="showModal = false" @post-created="fetchPosts" />
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
    }
  }
}
</script>