import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    posts: [],
    isLoggedIn: false,
    items: []
  },
  mutations: {
    setUser(state, user) {
      state.user = user
      state.isLoggedIn = !!user
    },
    setPosts(state, posts) {
      state.posts = posts
    },
    setLoginStatus(state, status) {
      state.isLoggedIn = status
    },
    setItems(state, items) {
      state.items = items
    }
  },
  actions: {
    login({ commit }, user) {
      commit('setUser', user)
      localStorage.setItem('token', user.token)
      localStorage.setItem('username', user.username)
      localStorage.setItem('userId', user.userId)
      localStorage.setItem('userIcon', user.icon || 'fas fa-user-circle')
      commit('setLoginStatus', true)
    },
    logout({ commit }) {
      commit('setUser', null)
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('userId')
      localStorage.removeItem('userIcon')
    },
    fetchPosts({ commit }) {
      // Ici, vous feriez un appel API réel pour récupérer les posts
      fetch('http://localhost:5000/posts')
        .then(response => response.json())
        .then(data => {
          commit('setPosts', data)
        })
        .catch(error => console.error('Error fetching posts:', error))
    },
    checkLoginStatus({ commit }) {
      const token = localStorage.getItem('token')
      const username = localStorage.getItem('username')
      const userId = localStorage.getItem('userId')
      const icon = localStorage.getItem('userIcon') || 'fas fa-user-circle'
      if (token && username && userId) {
        commit('setUser', { token, username, userId, icon })
        commit('setLoginStatus', true)
      } else {
        commit('setUser', null)
        commit('setLoginStatus', false)
      }
    },
    async register({ dispatch }, userData) {
      try {
        const response = await fetch('http://localhost:5000/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
        if (response.ok) {
          const data = await response.json();
          // After successful registration, automatically log in the user
          await dispatch('login', data);
          return { success: true };
        } else {
          const error = await response.json();
          return { success: false, message: error.message };
        }
      } catch (error) {
        console.error('Registration error:', error);
        return { success: false, message: 'An error occurred during registration' };
      }
    },
    async createPost({ dispatch, state }, postData) {
      try {
        const response = await fetch('http://localhost:5000/posts', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${state.user.token}`
          },
          body: postData // Now we're sending FormData directly
        });
        if (response.ok) {
          await dispatch('fetchPosts');
          return { success: true };
        } else {
          const error = await response.json();
          return { success: false, message: error.message };
        }
      } catch (error) {
        console.error('Error creating post:', error);
        return { success: false, message: 'An error occurred while creating the post' };
      }
    },
    async fetchItems({ commit }) {
      try {
        const response = await fetch('http://localhost:5000/items');
        if (response.ok) {
          const items = await response.json();
          commit('setItems', items);
        } else {
          console.error('Failed to fetch items');
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    },
    async updateUserIcon({ commit, state }, icon) {
      try {
        const formData = new FormData();
        formData.append('icon', icon);

        const response = await fetch('http://localhost:5000/user/icon', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${state.user.token}`
          },
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('Failed to update icon');
        }
        
        const data = await response.json();
        commit('setUser', { ...state.user, icon: data.icon });
        localStorage.setItem('userIcon', data.icon);
        return data;
      } catch (error) {
        console.error('Error updating icon:', error);
        throw error;
      }
    }
  },
  getters: {
    isLoggedIn: state => state.isLoggedIn,
    username: state => state.user ? state.user.username : '',
    userIcon: state => state.user && state.user.icon ? state.user.icon : 'fas fa-user-circle'
  }
})