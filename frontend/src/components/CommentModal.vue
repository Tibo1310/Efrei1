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
              <strong>{{ comment.username }}</strong>
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
export default {
  name: 'CommentModal',
  props: ['post'],
  data() {
    return {
      newComment: '',
      isSubmitting: false
    };
  },
  methods: {
    async addComment() {
      if (this.newComment.trim() && !this.isSubmitting) {
        this.isSubmitting = true;
        try {
          const addedComment = await this.$store.dispatch('addComment', {
            postId: this.post._id,
            comment: this.newComment
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