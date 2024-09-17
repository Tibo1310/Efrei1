<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center">Ajouter un Item</h1>
    <form @submit.prevent="addItem" class="border p-4 rounded shadow-sm bg-light">
      <div class="mb-3">
        <label for="name" class="form-label">Nom :</label>
        <input type="text" id="name" class="form-control" v-model="name" required />
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Description :</label>
        <input type="text" id="description" class="form-control" v-model="description" />
      </div>
      <button type="submit" class="btn btn-primary w-100">Ajouter</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      description: ''
    };
  },
  methods: {
    async addItem() {
      try {
        const response = await fetch('http://localhost:5000/items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: this.name,
            description: this.description
          })
        });
        if (response.ok) {
          alert('Item ajouté avec succès');
          this.name = '';
          this.description = '';
        } else {
          alert('Erreur lors de l\'ajout');
        }
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'item :', error);
      }
    }
  }
};
</script>
