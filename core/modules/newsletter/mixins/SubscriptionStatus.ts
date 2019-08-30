import { required, email } from 'vuelidate/lib/validators'

/**
 * Newsletter subscription form component.
 *
 * #### Data
 * - `email: String` - email that will be used for subscription, validated with vuelidate (email, required)
 *
 * ### Computed
 * - `isSubscribed: boolean` - returns true if user subscribed to the newsletter in this session
 *
 * #### Methods
 * - `checkStatus(success?: Function, failure?: Function)` dispatches `newsletter/status` with `email` data property. `success(res)` and `failure(err)` are callback functions called depending on subscription result and contain response info or error.
 *
 */
export default {
  name: 'SubscriptionStatus',
  data () {
    return {
      email: '',
      user: {
        isSubscribed: false
      }
    }
  },
  validations: {
    email: {
      required,
      email
    }
  },
  methods: {
    onLoggedIn () {
      this.email = this.$store.state.user.current.email
      this.checkStatus(isSubscribed => {
        this.user.isSubscribed = isSubscribed
      })
    },
    checkStatus (success?: Function, failure?: Function) {
      // argument omitted for validation purposes
      if (!this.$v.$invalid) {
        return this.$store.dispatch('newsletter/status', this.email).then(res => {
          if (success) success(res)
        }).catch(err => {
          if (failure) failure(err)
        }
        )
      }
    }
  },
  beforeMount () {
    // the user might already be logged in, so check the subscription status
    if (this.$store.state.user.current) this.onLoggedIn()
    this.$bus.$on('user-after-loggedin', this.onLoggedIn)
  },
  beforeDestroy () {
    this.$bus.$off('user-after-loggedin', this.onLoggedIn)
  },
  computed: {
    isSubscribed (): boolean {
      return this.$store.getters['newsletter/isSubscribed']
    }
  }
}
