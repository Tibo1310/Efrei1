<template>
  <div class="icon-selector-overlay" @click="$emit('close')">
    <div class="icon-selector-content" @click.stop>
      <h3>Select an Icon</h3>
      <div class="icon-grid">
        <div v-for="icon in icons" :key="icon" class="icon-item" @click="selectIcon(icon)">
          <i :class="icon"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IconSelector',
  data() {
    return {
      icons: [
        'fas fa-user-circle',
        'fas fa-user-astronaut',
        'fas fa-user-ninja',
        'fas fa-user-secret',
        'fas fa-user-tie',
        'fas fa-user-graduate',
        'fas fa-user-md',
        'fas fa-user-nurse',
        'fas fa-user-cog'
      ]
    }
  },
  methods: {
    selectIcon(icon) {
      this.$emit('select-icon', icon);
    }
  }
}
</script>

<style scoped>
.icon-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
  max-width: 300px;
  width: 100%;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 15px;
}

.icon-item {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  background-color: #f0f0f0;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.icon-item:hover {
  background-color: #e0e0e0;
}

.icon-item i {
  font-size: 24px;
}
</style>