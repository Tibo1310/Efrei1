<template>
  <div class="icon-selector-backdrop" @click="$emit('close')">
    <div class="icon-selector-content" @click.stop>
      <div class="icon-selector-header">
        <h5 class="icon-selector-title">Select an icon</h5>
        <button type="button" class="close" @click="$emit('close')" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="icon-selector-body">
        <h6>Custom icon</h6>
        <div class="custom-icon-upload" @dragover.prevent @drop.prevent="handleDrop">
          <input type="file" @change="handleFileUpload" ref="fileInput" style="display: none;">
          <div v-if="previewUrl" class="custom-icon-preview">
            <img :src="previewUrl" alt="Custom icon preview">
          </div>
          <div v-else class="custom-icon-placeholder">
            Drag and drop an image here or <button @click="triggerFileInput">choose a file</button>
          </div>
        </div>
        <button class="btn btn-primary mt-3" @click="validateCustomIcon">Validate</button>
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
.icon-selector-backdrop {
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

.icon-selector-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.icon-selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icon-selector-title {
  margin: 0;
}

.custom-icon-upload {
  margin-top: 20px;
  padding: 20px;
  border: 2px dashed #ddd;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
}

.custom-icon-placeholder {
  color: #888;
}

.custom-icon-preview img {
  max-width: 100%;
  max-height: 100px;
  object-fit: contain;
}
</style>