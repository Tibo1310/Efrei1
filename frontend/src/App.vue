<script>
import { mapActions } from 'vuex';

export default {
  name: 'App',
  methods: {
    ...mapActions(['checkAuth'])
  },
  created() {
    this.checkAuth();
  }
}
</script>