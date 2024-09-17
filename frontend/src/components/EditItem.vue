<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center">Modifier un Item</h1>
    <form @submit.prevent="editItem" class="border p-4 rounded shadow-sm bg-light">
      <div class="mb-3">
        <label for="name" class="form-label">Nom :</label>
        <input type="text" id="name" class="form-control" v-model="name" required />
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Description :</label>
        <input type="text" id="description" class="form-control" v-model="description" />
      </div>
      <button type="submit" class="btn btn-primary w-100">Modifier</button>
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
  async created() {
    const id = this.$route.params.id;
    const response = await fetch(`http://localhost:5000/items/${id}`);
    const item = await response.json();
    this.name = item.name;
    this.description = item.description;
  },
  methods: {
    async editItem() {
      const id = this.$route.params.id;
      try {
        const response = await fetch(`http://localhost:5000/items/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: this.name,
            description: this.description
          })
        });
        if (response.ok) {
          alert('Item modifié avec succès');
          this.$router.push('/');
        } else {
          alert('Erreur lors de la modification');
        }
      } catch (error) {
        console.error('Erreur lors de la modification de l\'item :', error);
      }
    }
  }
};
</script>
