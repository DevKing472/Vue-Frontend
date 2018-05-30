export default {
  name: 'Breadcrumbs',
  props: {
    routes: {
      type: Array,
      required: true
    },
    activeRoute: {
      type: String,
      required: true
    }
  }
}
