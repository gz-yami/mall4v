import * as Vuex from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import common from './modules/common'
import user from './modules/user'
import prod from './modules/prod'

export default Vuex.createStore({
  modules: {
    common,
    user,
    prod
  },
  mutations: {
    // 重置vuex本地储存状态
    resetStore (state) {
      Object.keys(state).forEach((key) => {
        state[key] = cloneDeep(process.env.VUE_APP_RESOURCES_URL.storeState[key])
      })
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})
