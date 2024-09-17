<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center">Bienvenue sur mon site</h1>
    <h2 class="mb-4 text-center">Liste des Items</h2>
    <ul class="list-group">
      <li v-for="item in items" :key="item._id" class="list-group-item">
        <strong>{{ item.name }}:</strong> {{ item.description }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: []
    };
  },
  created() {
    this.fetchItems();
  },
  methods: {
    async fetchItems() {
      try {
        const response = await fetch('http://localhost:5000/items');
        const data = await response.json();
        this.items = data;
      } catch (error) {
        console.error('Erreur lors de la récupération des items :', error);
      }
    }
  }
};
</script>
