/**
 * @Author: Sam
 * @Date: 2020/1/3
 * @Version: 1.0
 **/
import * as types from './mutation-types'

const mutations = {
  [types.LOGIN](state, token) {
    localStorage.token = token
    state.token = token
  },
  [types.LOGOUT](state) {
    localStorage.removeItem('token')
    state.token = null
  },
  [types.SET_ACCOUNT](state, account) {
    if (Object.keys(account).length !== 0) {
      localStorage.setItem('account', JSON.stringify(account))
    } else {
      localStorage.removeItem('account')
    }
    state.account = account
  }
}

export default mutations
