import { createStore } from 'vuex'
import router from '../router'; // Assurez-vous d'importer le router

export default createStore({
  state: {
    user: null,
    posts: [],
    isLoggedIn: false,
    items: [],
    userActivities: []
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
    },
    setUserProfile(state, profile) {
      state.user = { ...state.user, ...profile };
    },
    setUserActivities(state, activities) {
      state.userActivities = activities;
    },
    addUserActivity(state, activity) {
      state.userActivities.unshift(activity);
    },
    updatePostLikes(state, { postId, likes }) {
      const postIndex = state.posts.findIndex(post => post._id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex].likes = Array.isArray(likes) ? likes : [];
      }
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
      commit('setLoginStatus', false)
      router.push('/login') // Rediriger vers la page de connexion après la déconnexion
    },
    fetchPosts({ commit }) {
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
          body: postData
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
    },
    async fetchUserProfile({ commit, state }) {
      try {
        const response = await fetch(`http://localhost:5000/user/${state.user.userId}`, {
          headers: {
            'Authorization': `Bearer ${state.user.token}`
          }
        });
        if (response.ok) {
          const userData = await response.json();
          console.log('Fetched user profile:', userData);
          commit('setUserProfile', userData);
        } else {
          console.error('Failed to fetch user profile');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    },
    async updateUserProfile({ commit, state }, updatedProfile) {
      try {
        const response = await fetch(`http://localhost:5000/user/${state.user.userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.user.token}`
          },
          body: JSON.stringify(updatedProfile)
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update profile');
        }
        const updatedUser = await response.json();
        commit('setUserProfile', updatedUser);
        return { success: true };
      } catch (error) {
        console.error('Error updating user profile:', error);
        return { success: false, message: error.message };
      }
    },
    async likePost({ commit, state }, postId) {
      if (!postId) {
        console.error('Invalid postId:', postId);
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/posts/${postId}/like`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${state.user.token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          commit('updatePostLikes', { postId, likes: Array.isArray(data.likes) ? data.likes : [] });
          commit('addUserActivity', { type: 'likes', postId, date: new Date() });
        } else {
          console.error('Failed to like post:', await response.text());
        }
      } catch (error) {
        console.error('Error liking post:', error);
      }
    },
    async addComment({ commit, state }, { postId, comment }) {
      try {
        const response = await fetch(`http://localhost:5000/posts/${postId}/comment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.user.token}`
          },
          body: JSON.stringify({ comment })
        });
        if (response.ok) {
          commit('addUserActivity', { type: 'comments', postId, comment, date: new Date() });
        }
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    },
    async repostPost({ commit, state }, postId) {
      try {
        const response = await fetch(`http://localhost:5000/posts/${postId}/repost`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${state.user.token}`
          }
        });
        if (response.ok) {
          commit('addUserActivity', { type: 'reposts', postId, date: new Date() });
        }
      } catch (error) {
        console.error('Error reposting:', error);
      }
    },
    async sharePost({ commit, state }, postId) {
      try {
        const response = await fetch(`http://localhost:5000/posts/${postId}/share`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${state.user.token}`
          }
        });
        if (response.ok) {
          commit('addUserActivity', { type: 'shares', postId, date: new Date() });
        }
      } catch (error) {
        console.error('Error sharing post:', error);
      }
    },
    async fetchUserActivities({ commit, state }) {
      try {
        console.log('Fetching user activities for user:', state.user.userId);
        const response = await fetch(`http://localhost:5000/user/${state.user.userId}/activities`, {
          headers: {
            'Authorization': `Bearer ${state.user.token}`
          }
        });
        if (response.ok) {
          const activities = await response.json();
          console.log('Fetched activities:', activities);
          commit('setUserActivities', activities);
        } else {
          console.error('Failed to fetch user activities:', await response.text());
          commit('setUserActivities', []);
        }
      } catch (error) {
        console.error('Error fetching user activities:', error);
        commit('setUserActivities', []);
      }
    }
  },
  getters: {
    isLoggedIn: state => state.isLoggedIn,
    username: state => state.user ? state.user.username : '',
    userIcon: state => state.user && state.user.icon ? state.user.icon : 'fas fa-user-circle'
  }
})