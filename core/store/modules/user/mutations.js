import * as types from '../../mutation-types'

export default {
  [types.USER_TOKEN_CHANGED] (state, payload) {
    state.token = payload.newToken
    if (payload.meta && payload.meta.refreshToken) {
      state.refreshToken = payload.meta.refreshToken // store the refresh token
      console.log('Refresh token is set to', state.refreshToken)
    }
  },
  [types.USER_START_SESSION] (state) {
    state.session_started = new Date()
  },
  [types.USER_INFO_LOADED] (state, currentUser) {
    state.current = currentUser
  },
  [types.USER_ORDERS_HISTORY_LOADED] (state, ordersHistory) {
    state.orders_history = ordersHistory
  },
  [types.USER_END_SESSION] (state) {
    state.token = ''
    state.current = null
    state.session_started = null
  },
  [types.USER_UPDATE_PREFERENCES] (state, newsletterPreferences) {
    state.newsletter = newsletterPreferences
  }
}
