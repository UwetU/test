import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: {
      state: '',
      message: ''
    },
  },
  getters: {
    status: state => state.status,
    selectedItems: state => state.selectedItems,
  },
  mutations: {
    setStatus(state, status) {
      state.status = status;
    },
  },
})
