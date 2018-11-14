// if you need to have BABEL applied to extensions inside node_modules
// (by default excluded from BABEL) please add ".js" file ext inside require
import Vue from 'vue'
// EXTENSIONS ARE DEPRECIATED, use modules instead
const extensionList = []
if (!Vue.prototype.$isServer) { // extensions that are not required in the SSR mode
  extensionList.push(require('@vue-storefront/extension-google-analytics/index.js'))
}
extensionList.push(require('@vue-storefront/extension-magento2-cms/index.js'))
extensionList.push(require('@vue-storefront/raw-output-example/index.js'))
extensionList.push(require('@vue-storefront/extension-payment-backend-methods/index.js'))
extensionList.push(require('@vue-storefront/extension-payment-cash-on-delivery/index.js'))
export default extensionList
