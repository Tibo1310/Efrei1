import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    posts: []
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setPosts(state, posts) {
      state.posts = posts
    }
  },
  actions: {
    login({ commit }, user) {
      commit('setUser', user)
    },
    logout({ commit }) {
      commit('setUser', null)
    },
    fetchPosts({ commit }) {
      // Ici, vous feriez un appel API pour récupérer les posts
      // Pour l'exemple, nous utilisons des données factices
      const posts = [
        { id: 1, title: 'Premier post', content: 'Contenu du premier post' },
        { id: 2, title: 'Deuxième post', content: 'Contenu du deuxième post' }
      ]
      commit('setPosts', posts)
    }
  },
  getters: {
    isLoggedIn: state => !!state.user,
    username: state => state.user ? state.user.username : ''
  }
})