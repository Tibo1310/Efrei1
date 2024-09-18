<template>
  <div class="floating-action-button" @click="$emit('click')">
    <i class="fas fa-plus"></i>
  </div>
</template>

<script>
export default {
  name: 'FloatingActionButton'
}
</script>

<style scoped>
.floating-action-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  cursor: pointer;
  transition: background-color 0.3s;
}

.floating-action-button:hover {
  background-color: #0056b3;
}
</style>