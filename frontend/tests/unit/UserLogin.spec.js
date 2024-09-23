import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import UserLogin from '@/components/UserLogin.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('UserLogin.vue', () => {
  let actions;
  let store;

  beforeEach(() => {
    actions = {
      login: jest.fn()
    };
    store = new Vuex.Store({
      actions
    });
  });

  it('renders login form', () => {
    const wrapper = shallowMount(UserLogin, { store, localVue });
    expect(wrapper.find('form').exists()).toBe(true);
  });

  it('emits login event on form submit', async () => {
    const wrapper = shallowMount(UserLogin, { store, localVue });
    wrapper.setData({ email: 'test@example.com', password: 'password' });
    await wrapper.find('form').trigger('submit.prevent');
    expect(actions.login).toHaveBeenCalled();
  });
});