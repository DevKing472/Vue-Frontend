import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/store/types/RootState'
import CmsPageState from '../../types/CmsPageState'

const getters: GetterTree<CmsPageState, RootState> = {
  cmsPages: (state) => state.items
}

export default getters
