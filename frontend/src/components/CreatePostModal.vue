<template>
  <div class="modal-backdrop" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h5 class="modal-title">Publish a Post</h5>
        <button type="button" class="close" @click="$emit('close')" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="submitPost">
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" class="form-control" id="title" v-model="title" required>
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea class="form-control" id="description" v-model="description" rows="3" required></textarea>
          </div>
          <div class="form-group">
            <label for="media">Image (optional)</label>
            <input type="file" class="form-control-file" id="media" @change="handleFileUpload" accept="image/*">
          </div>
          <button type="submit" class="btn btn-primary mt-3">Publish</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreatePostModal',
  data() {
    return {
      title: '',
      description: '',
      media: null
    }
  },
  methods: {
    handleFileUpload(event) {
      this.media = event.target.files[0];
    },
    async submitPost() {
      const formData = new FormData();
      formData.append('title', this.title);
      formData.append('description', this.description);
      if (this.media) {
        formData.append('media', this.media);
      }

      try {
        const response = await fetch('http://localhost:5000/posts', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });

        if (response.ok) {
          this.$emit('post-created');
          this.$emit('close');
        } else {
          const error = await response.json();
          alert(error.message || 'Failed to create post');
        }
      } catch (error) {
        console.error('Error creating post:', error);
        alert('An error occurred while creating the post');
      }
    }
  }
}
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

.close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>