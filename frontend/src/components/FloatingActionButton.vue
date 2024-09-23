<template>
  <div class="floating-action-button-container">
    <div class="floating-action-button" @click="$emit('click')">
      <i class="fas fa-plus"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FloatingActionButton'
}
</script>

<style scoped>
.floating-action-button-container {
  position: fixed;
  bottom: 80px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 1000;
}

.floating-action-button {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: black;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.floating-action-button:hover {
  background-color: #333;
  transform: scale(1.1);
}

.floating-action-button i {
  transition: font-size 0.3s ease;
}

@media (min-width: 768px) {
  .floating-action-button {
    width: 80px;
    height: 80px;
    font-size: 32px;
  }
}

@media (min-width: 1024px) {
  .floating-action-button {
    width: 90px;
    height: 90px;
    font-size: 36px;
  }
}

@media (min-width: 1440px) {
  .floating-action-button {
    width: 100px;
    height: 100px;
    font-size: 40px;
  }
}
</style>