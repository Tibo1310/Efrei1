<template>
  <div class="modal-backdrop" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h5 class="modal-title">Ajouter un commentaire</h5>
        <button type="button" class="close" @click="$emit('close')" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <textarea v-model="comment" class="form-control" rows="3" placeholder="Votre commentaire..."></textarea>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="$emit('close')">Annuler</button>
        <button type="button" class="btn btn-primary" @click="submitComment">Commenter</button>
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
      comment: ''
    };
  },
  methods: {
    submitComment() {
      if (this.comment.trim()) {
        this.$emit('comment-added', this.comment);
        this.comment = '';
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
}
</style>