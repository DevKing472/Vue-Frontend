import store from '@vue-storefront/store'

export const thumbnail = {
  methods: {
    /**
     * Return thumbnail url for specific base url
     * @param {String} relativeUrl
     * @param {Int} width
     * @param {Int} height
     */
    getThumbnail (relativeUrl, width, height) {
      if (store.state.config.images.useExactUrlsNoProxy) {
        return relativeUrl // this is exact url mode
      } else {
        if (relativeUrl && (relativeUrl.indexOf('://') > 0 || relativeUrl.indexOf('?') > 0 || relativeUrl.indexOf('&') > 0)) relativeUrl = encodeURIComponent(relativeUrl)
        let baseUrl = store.state.config.images.baseUrl
        if (baseUrl.indexOf('{{') >= 0) {
          baseUrl = baseUrl.replace('{{url}}', relativeUrl)
          baseUrl = baseUrl.replace('{{width}}', width)
          baseUrl = baseUrl.replace('{{height}}', height)
        }
        return relativeUrl && relativeUrl.indexOf('no_selection') < 0 ? `${baseUrl}${parseInt(width)}/${parseInt(height)}/resize${relativeUrl}` : store.state.config.images.productPlaceholder || ''
      }
    }
  }
}
