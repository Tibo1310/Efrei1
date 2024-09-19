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
          <div class="form-group mb-3">
            <label for="title" class="form-label">Title</label>
            <input type="text" class="form-control" id="title" v-model="title" required placeholder="Enter post title">
          </div>
          <div class="form-group mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea class="form-control" id="description" v-model="description" rows="4" required placeholder="Write your post content here"></textarea>
          </div>
          <div class="form-group mb-3">
            <label for="media" class="form-label">Image (optional)</label>
            <div class="custom-file">
              <input type="file" class="custom-file-input" id="media" @change="handleFileUpload" accept="image/*">
              <label class="custom-file-label" for="media">{{ mediaLabel }}</label>
            </div>
          </div>
          <div v-if="previewUrl" class="mb-3">
            <img :src="previewUrl" alt="Preview" class="img-preview">
          </div>
          <button type="submit" class="btn btn-primary w-100">Publish</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'CreatePostModal',
  data() {
    return {
      title: '',
      description: '',
      media: null,
      mediaLabel: 'Choose an image',
      previewUrl: null
    }
  },
  methods: {
    ...mapActions(['createPost']),
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.media = file;
      this.mediaLabel = file ? file.name : 'Choose an image';
      
      if (file) {
        const reader = new FileReader();
        reader.onload = e => this.previewUrl = e.target.result;
        reader.readAsDataURL(file);
      } else {
        this.previewUrl = null;
      }
    },
    async submitPost() {
      const formData = new FormData();
      formData.append('title', this.title);
      formData.append('description', this.description);
      if (this.media) {
        formData.append('media', this.media);
      }

      const result = await this.createPost(formData);
      if (result.success) {
        this.$emit('post-created');
        this.$emit('close');
      } else {
        alert(result.message);
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
  max-height: 90vh;
  overflow-y: auto;
}

.close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.custom-file {
  position: relative;
  display: inline-block;
  width: 100%;
  height: calc(1.5em + 0.75rem + 2px);
  margin-bottom: 0;
}

.custom-file-input {
  position: relative;
  z-index: 2;
  width: 100%;
  height: calc(1.5em + 0.75rem + 2px);
  margin: 0;
  opacity: 0;
}

.custom-file-label {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1;
  height: calc(1.5em + 0.75rem + 2px);
  padding: 0.375rem 0.75rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.img-preview {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
}

@media (max-width: 576px) {
  .modal-content {
    width: 95%;
    padding: 15px;
  }
}
</style>