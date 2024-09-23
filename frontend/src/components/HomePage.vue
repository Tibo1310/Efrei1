<template>
  <div class="container mt-5">
    <div v-if="posts.length === 0" class="text-center">
      <p>No posts yet. Be the first to create a post!</p>
    </div>
    <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div v-for="post in posts" :key="post._id" class="col">
        <div class="card h-100 shadow-sm border-dark">
          <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
              <img v-if="post.author && post.author.icon && post.author.icon.startsWith('/uploads/')" :src="`http://localhost:5000${post.author.icon}`" class="user-icon me-2" />
              <i v-else :class="[post.author ? post.author.icon : 'fas fa-user-circle', 'user-icon', 'me-2', 'basic-icon']"></i>
              <div>
                <div class="username">{{ post.author ? post.author.username : 'Unknown' }}</div>
                <div class="followers small">{{ post.author ? post.author.followers || 0 : 0 }} abonnés</div>
              </div>
            </div>
            <button v-if="isLoggedIn && post.author && user && post.author._id !== user.userId" 
                    @click="followUser(post.author._id)" 
                    class="btn btn-sm btn-outline-light">
              {{ isFollowing(post.author._id) ? 'Unfollow' : 'Follow' }}
            </button>
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ post.name }}</h5>
            <p class="card-text flex-grow-1">{{ post.description }}</p>
            <div v-if="post.mediaUrl" class="card-img-wrapper mb-3">
              <img :src="`http://localhost:5000${post.mediaUrl}`" class="card-img rounded" alt="Post media">
            </div>
          </div>
          <div class="card-footer bg-light d-flex justify-content-between align-items-center">
            <div class="post-date small text-muted">{{ new Date(post.dateCreated).toLocaleDateString() }}</div>
            <div class="card-actions d-flex">
              <div class="action me-3" @click="likePost(post)">
                <i :class="['fas', 'fa-thumbs-up', { 'text-primary': isLikedByUser(post) }]"></i>
                <span class="ms-1">{{ post.likes ? post.likes.length : 0 }}</span>
              </div>
              <div class="action me-3" @click="showCommentModalForPost(post)">
                <i class="fas fa-comment"></i>
                <span class="ms-1">{{ post.comments ? post.comments.length : 0 }}</span>
              </div>
              <div class="action" @click="sharePost(post)">
                <i :class="['fas', 'fa-share', { 'text-primary': isSharedByUser(post) }]"></i>
                <span class="ms-1">{{ post.shares || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FloatingActionButton v-if="isLoggedIn" @click="showCreatePostModal = true" />
    <CreatePostModal v-if="showCreatePostModal" @close="showCreatePostModal = false" @post-created="handlePostCreated" />
    <CommentModal 
      v-if="showCommentModal" 
      :post="selectedPost" 
      @close="showCommentModal = false"
      @comment-added="handleCommentAdded"
    />
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
    ...mapState(['posts', 'isLoggedIn', 'user', 'userActivities'])
  },
  methods: {
    ...mapActions(['fetchPosts', 'likePost', 'repostPost', 'sharePost', 'addComment', 'fetchUserActivities', 'followUser']),
    handlePostCreated() {
      this.showCreatePostModal = false;
      this.fetchPosts();
    },
    showCommentModalForPost(post) {
      this.selectedPost = post;
      this.showCommentModal = true;
    },
    handleCommentAdded(newComment) {
      const postIndex = this.posts.findIndex(p => p._id === this.selectedPost._id);
      if (postIndex !== -1) {
        const updatedPost = { ...this.posts[postIndex] };
        if (!updatedPost.comments) {
          updatedPost.comments = [];
        }
        // Vérifier si commentaire existe déjà avant de l'ajouter
        if (!updatedPost.comments.some(c => c._id === newComment._id)) {
          updatedPost.comments.push(newComment);
          this.$store.commit('updatePost', { index: postIndex, post: updatedPost });
        }
      }
      this.showCommentModal = false;
    },
    async likePost(post) {
      if (!this.user || !this.user.userId) {
        console.log('User not logged in');
        return; // Ou rediriger vers la page de connexion
      }
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
      // Vérifier si utilisateur connecté et si le post a des likes
      if (this.user && this.user.userId && Array.isArray(post.likes)) {
        return post.likes.includes(this.user.userId);
      }
      return false; // false si l'utilisateur n'est pas connecté ou si le post n'a pas de likes
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
    isSharedByUser(post) {
      return this.userActivities && this.userActivities.some(activity => 
        activity.type === 'share' && activity.postId._id === post._id
      );
    },
    async sharePost(post) {
      if (!this.user || !this.user.userId) {
        console.log('User not logged in');
        return; // Ou rediriger vers la page de connexion
      }
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
            // Mettre à jour les activités de l'utilisateur après le partage
            await this.fetchUserActivities();
          }
        } catch (error) {
          console.error('Error sharing post:', error);
        }
      } else {
        console.error('Invalid post object:', post);
      }
    },
    isFollowing(authorId) {
      // à implémenter plus tard
      return this.user && this.user.following && this.user.following.includes(authorId);
    },
    
    async followUser(authorId) {
      if (this.isLoggedIn && this.user && this.user.userId) {
        try {
          await this.$store.dispatch('followUser', authorId);
          // update les posts ou l'utilisateur après le suivi
          await this.fetchPosts();
        } catch (error) {
          console.error('Error following user:', error);
        }
      } else {
        console.log('User not logged in');
        // Rediriger vers la page de connexion ou afficher un message
      }
    }
  },
  async created() {
    await this.fetchPosts();
    if (this.isLoggedIn) {
      await this.fetchUserActivities();
    }
  },
  watch: {
    // Surveiller les changements dans userActivities
    userActivities: {
      handler() {
        // Forcer une mise à jour du composant
        this.$forceUpdate();
      },
      deep: true
    }
  }
}
</script>

<style scoped>
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

.text-primary {
  color: #007bff !important;
}
</style>