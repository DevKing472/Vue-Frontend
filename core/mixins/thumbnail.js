import { getThumbnailPath as _thumbnailHelper } from '@vue-storefront/store/helpers'

export const thumbnail = {
  methods: {
    /**
     * Return thumbnail url for specific base url
     * @param {String} relativeUrl
     * @param {Int} width
     * @param {Int} height
     */
    getThumbnail (relativeUrl, width, height) {
      return _thumbnailHelper(relativeUrl, width, height)
    }
  }
}
