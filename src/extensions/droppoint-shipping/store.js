import { execute as taskExecute } from '@vue-storefront/store/lib/task'
import * as entities from '@vue-storefront/store/lib/entities'

const state = {
}

const getters = {
}

// actions
const actions = {
  fetch ({ commit }, request) {
    const taskId = entities.uniqueEntityId(request)
    request.task_id = taskId.toString()
    return taskExecute(request)
  }
}

const mutations = {
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
