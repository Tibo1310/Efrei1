<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center">Bienvenue sur le gestionnaire d'items</h1>
    <ItemList />
  </div>
</template>

<script>
import ItemList from './ItemList.vue'

export default {
  name: 'HomePage',
  components: {
    ItemList
  }
}
</script>
