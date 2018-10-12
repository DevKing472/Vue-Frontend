// this component is depreciated
export default {
  name: 'MyNewsletter',
  data () {
    return {
      user: {
        isSubscribed: false
      }
    }
  },
  methods: {
    unsubscribe () {
      this.$store.dispatch('mailchimp/unsubscribe', this.$store.state.user.current.email).then(res => {
        this.user.isSubscribed = false
      }).catch(err =>
        this.$emit('unsubscription-error', err)
      )
    },
    subscribe () {
      this.$store.dispatch('mailchimp/subscribe', this.$store.state.user.current.email).then(res => {
        this.user.isSubscribed = true
      }).catch(err =>
        this.$emit('subscription-error', err)
      )
    },
    updateNewsletter () {
      if (this.user.isSubscribed) {
        this.subscribe()
      } else {
        this.unsubscribe()
      }
      this.exitSection()
    }
  }
}
