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
            <i v-else :class="[post.author ? post.author.icon : 'fas fa-user-circle', 'user-icon', 'me-2', 'basic-icon']"></i>
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
            <div class="card-actions d-flex justify-content-between mt-2">
              <div class="action" @click="likePost(post)">
                <i :class="['fas', 'fa-thumbs-up', { 'text-primary': isLikedByUser(post) }]"></i>
                <span>{{ post.likes ? post.likes.length : 0 }}</span>
              </div>
              <div class="action" @click="showCommentModalForPost(post)">
                <i class="fas fa-comment"></i>
                <span>{{ post.comments ? post.comments.length : 0 }}</span>
              </div>
              <div class="action" @click="repostPost(post)">
                <i class="fas fa-retweet"></i>
                <span>{{ post.reposts ? post.reposts.length : 0 }}</span>
              </div>
              <div class="action" @click="sharePost(post)">
                <i class="fas fa-share"></i>
                <span>{{ post.shares ? post.shares.length : 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FloatingActionButton v-if="isLoggedIn" @click="showCreatePostModal = true" />
    <CreatePostModal v-if="showCreatePostModal" @close="showCreatePostModal = false" @post-created="handlePostCreated" />
    <CommentModal v-if="showCommentModal" :post="selectedPost" @close="showCommentModal = false" @comment-added="handleCommentAdded" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import FloatingActionButton from './FloatingActionButton.vue';
import CreatePostModal from './CreatePostModal.vue';
import CommentModal from './CommentModal.vue';

export default {
  name: 'HomePage',
  components: {
    FloatingActionButton,
    CreatePostModal,
    CommentModal
  },
  data() {
    return {
      showCreatePostModal: false,
      showCommentModal: false,
      selectedPost: null
    }
  },
  computed: {
    ...mapState(['posts', 'isLoggedIn', 'user'])
  },
  methods: {
    ...mapActions(['fetchPosts', 'likePost', 'repostPost', 'sharePost', 'addComment']),
    handlePostCreated() {
      this.showCreatePostModal = false;
      this.fetchPosts();
    },
    showCommentModalForPost(post) {
      this.selectedPost = post;
      this.showCommentModal = true;
    },
    handleCommentAdded(comment) {
      this.addComment({ postId: this.selectedPost._id, comment });
      this.showCommentModal = false;
    },
    async likePost(post) {
      if (post && post._id) {
        try {
          const result = await this.$store.dispatch('likePost', post._id);
          if (result.success) {
            const index = this.posts.findIndex(p => p._id === post._id);
            if (index !== -1) {
              const updatedPosts = [...this.posts];
              updatedPosts[index] = { ...updatedPosts[index], likes: result.likes };
              this.$store.commit('setPosts', updatedPosts);
            }
          }
        } catch (error) {
          console.error('Error liking post:', error);
        }
      } else {
        console.error('Invalid post object:', post);
      }
    },
    isLikedByUser(post) {
      return Array.isArray(post.likes) && post.likes.includes(this.user.userId);
    },
    async repostPost(post) {
      if (post && post._id) {
        try {
          const result = await this.$store.dispatch('repostPost', post._id);
          if (result.success) {
            const index = this.posts.findIndex(p => p._id === post._id);
            if (index !== -1) {
              const updatedPosts = [...this.posts];
              updatedPosts[index] = { ...updatedPosts[index], reposts: result.reposts };
              this.$store.commit('setPosts', updatedPosts);
            }
          }
        } catch (error) {
          console.error('Error reposting:', error);
        }
      } else {
        console.error('Invalid post object:', post);
      }
    },
    async sharePost(post) {
      if (post && post._id) {
        try {
          const result = await this.$store.dispatch('sharePost', post._id);
          if (result.success) {
            const index = this.posts.findIndex(p => p._id === post._id);
            if (index !== -1) {
              const updatedPosts = [...this.posts];
              updatedPosts[index] = { ...updatedPosts[index], shares: result.shares };
              this.$store.commit('setPosts', updatedPosts);
            }
          }
        } catch (error) {
          console.error('Error sharing post:', error);
        }
      } else {
        console.error('Invalid post object:', post);
      }
    }
  },
  created() {
    this.fetchPosts();
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

.basic-icon {
  font-size: 40px; /* Adjust the size to match the custom icons */
  line-height: 40px; /* Center the icon vertically */
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
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
}

.action {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.action i {
  font-size: 1.2rem;
  margin-right: 5px;
}

.action span {
  font-size: 0.9rem;
}

.text-primary {
  color: #007bff !important;
}
</style>