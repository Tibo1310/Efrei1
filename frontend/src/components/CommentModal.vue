<template>
  <div class="modal-backdrop" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h5 class="modal-title">Commentaires</h5>
        <button type="button" class="close" @click="$emit('close')" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="comments-list mb-3" style="max-height: 300px; overflow-y: auto;">
          <div v-for="comment in post.comments" :key="comment._id" class="comment mb-2 p-2 border-bottom">
            <div class="d-flex align-items-center mb-2">
              <img v-if="comment.user && comment.user.icon && comment.user.icon.startsWith('/uploads/')" 
                   :src="`http://localhost:5000${comment.user.icon}`" 
                   class="user-icon me-2" 
                   alt="User icon">
              <i v-else :class="['me-2', comment.user && comment.user.icon ? comment.user.icon : 'fas fa-user-circle']" 
                 style="font-size: 24px;"></i>
              <strong>{{ comment.username }}</strong>
            </div>
            <p>{{ comment.text }}</p>
            <small class="text-muted">{{ new Date(comment.date).toLocaleString() }}</small>
          </div>
        </div>
        <div class="input-group">
          <input type="text" class="form-control" v-model="newComment" placeholder="Ajouter un commentaire...">
          <button class="btn btn-dark" @click="addComment" :disabled="isSubmitting">Envoyer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'CommentModal',
  props: ['post'],
  data() {
    return {
      newComment: '',
      isSubmitting: false
    };
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async addComment() {
      if (this.newComment.trim() && !this.isSubmitting) {
        this.isSubmitting = true;
        try {
          const addedComment = await this.$store.dispatch('addComment', {
            postId: this.post._id,
            comment: this.newComment,
            userIcon: this.user.icon
          });
          addedComment.user = {
            icon: this.user.icon
          };
          this.$emit('comment-added', addedComment);
          this.newComment = '';
        } catch (error) {
          console.error('Error adding comment:', error);
          alert('Failed to add comment. Please try again.');
        } finally {
          this.isSubmitting = false;
        }
      }
    }
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  border: 2px solid black;
}

.modal-header {
  border-bottom: 1px solid black;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: black;
}

.form-control {
  border: 1px solid black;
}

.user-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.btn-dark {
  background-color: black;
  border-color: black;
}

.btn-dark:hover {
  background-color: #333;
  border-color: #333;
}

.comment {
  border-bottom: 1px solid #e9ecef;
}

@media (max-width: 576px) {
  .modal-content {
    width: 95%;
    padding: 15px;
  }
}
</style>