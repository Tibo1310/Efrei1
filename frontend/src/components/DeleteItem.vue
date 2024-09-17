<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center">Supprimer un Item</h1>
    <div class="alert alert-danger">
      Es-tu sûr de vouloir supprimer cet item ?
    </div>
    <button class="btn btn-danger w-100" @click="deleteItem">Supprimer</button>
  </div>
</template>

<script>
export default {
  methods: {
    async deleteItem() {
      const id = this.$route.params.id;
      try {
        const response = await fetch(`http://localhost:5000/items/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          alert('Item supprimé avec succès');
          this.$router.push('/');
        } else {
          alert('Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'item :', error);
      }
    }
  }
};
</script>
