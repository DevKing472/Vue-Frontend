export default {
  name: 'ProductAttribute',
  props: {
    product: {
      type: Object,
      required: true
    },
    attribute: {
      type: null,
      required: true
    },
    emptyPlaceholder: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      label: '',
      value: ''
    }
  },
  beforeMount () {
    this.label = this.attribute.default_frontend_label
    let parsedValues = this.product[this.attribute.attribute_code]

    if (!parsedValues) {
      this.value = this.emptyPlaceholder
    } else {
      parsedValues = parsedValues.split(',')
      let results = []
      for (let parsedVal of parsedValues) {
        if (this.attribute.options) {
          let option = this.attribute.options.find(av => {
            /* eslint eqeqeq: "off" */
            return av.value == parsedVal
          })
          if (option) {
            results.push(option.label)
          }
        } else {
          results.push(parsedVal)
        }
      }
      this.value = results.join(', ')
    }
  }
}
