<template>
  <div class="modal" tabindex="-1" role="dialog" style="display: block; background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Commentaires</h5>
          <button type="button" class="btn-close" @click="$emit('close')" aria-label="Close"></button>
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
            <button class="btn btn-primary" @click="addComment" :disabled="isSubmitting">Envoyer</button>
          </div>
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
            userIcon: this.user.icon // Use the icon from the Vuex store
          });
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
.user-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}
</style>