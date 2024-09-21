<template>
  <div class="modal-backdrop" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h5 class="modal-title">Select an icon</h5>
        <button type="button" class="close" @click="$emit('close')" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <h6>Custom icon</h6>
        <div class="custom-icon-upload" @dragover.prevent @drop.prevent="handleDrop">
          <input type="file" @change="handleFileUpload" ref="fileInput" style="display: none;">
          <div v-if="previewUrl" class="custom-icon-preview">
            <img :src="previewUrl" alt="Custom icon preview">
          </div>
          <div v-else class="custom-icon-placeholder">
            Drag and drop an image here or <button @click="triggerFileInput" class="btn btn-outline-dark btn-sm">choose a file</button>
          </div>
        </div>
        <button class="btn btn-dark mt-3 w-100" @click="validateCustomIcon">Validate</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IconSelector',
  data() {
    return {
      customIcon: null,
      previewUrl: null
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.customIcon = file;
      this.previewUrl = URL.createObjectURL(file);
    },
    handleDrop(event) {
      const file = event.dataTransfer.files[0];
      this.customIcon = file;
      this.previewUrl = URL.createObjectURL(file);
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    validateCustomIcon() {
      if (this.customIcon) {
        this.$emit('select-icon', this.customIcon);
      } else {
        alert('Please select a custom icon first.');
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

.modal-title {
  margin: 0;
}

.close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: black;
}

.custom-icon-upload {
  margin-top: 20px;
  padding: 20px;
  border: 2px dashed black;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
}

.custom-icon-placeholder {
  color: #495057;
}

.custom-icon-preview img {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
  margin: 0 auto;
  display: block;
}

.btn-dark {
  background-color: black;
  border-color: black;
}

.btn-dark:hover {
  background-color: #333;
  border-color: #333;
}

.btn-outline-dark {
  color: black;
  border-color: black;
}

.btn-outline-dark:hover {
  color: white;
  background-color: black;
}

@media (max-width: 576px) {
  .modal-content {
    width: 95%;
    padding: 15px;
  }
}
</style>