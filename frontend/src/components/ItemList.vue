<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">Liste des Items</h2>
    <ul class="list-group">
      <li v-for="item in items" :key="item._id" class="list-group-item">
        <strong>{{ item.name }}:</strong> {{ item.description }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['items'])
  },
  created() {
    this.fetchItems();
  },
  methods: {
    ...mapActions(['fetchItems'])
  }
};
</script>
