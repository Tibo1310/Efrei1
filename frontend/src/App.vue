<script>
import { mapActions } from 'vuex';

export default {
  name: 'App',
  methods: {
    ...mapActions(['checkAuth', 'fetchUserActivities'])
  },
  async created() {
    await this.checkAuth();
    if (this.$store.getters.isLoggedIn) {
      await this.fetchUserActivities();
    }
  }
}
</script>