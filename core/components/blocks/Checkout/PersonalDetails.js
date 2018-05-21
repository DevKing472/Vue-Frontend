import { mapState } from 'vuex'

export default {
  name: 'PersonalDetails',
  props: {
    isActive: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      isFilled: false,
      personalDetails: this.$store.state.checkout.personalDetails,
      createAccount: false,
      acceptConditions: false,
      password: '',
      rPassword: ''
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.current
    })
  },
  methods: {
    onLoggedIn (receivedData) {
      this.personalDetails = {
        firstName: receivedData.firstname,
        lastName: receivedData.lastname,
        emailAddress: receivedData.email
      }
    },
    sendDataToCheckout () {
      if (this.createAccount) {
        this.personalDetails.password = this.password
        this.personalDetails.createAccount = true
      } else {
        this.personalDetails.createAccount = false
      }
      this.$bus.$emit('checkout-after-personalDetails', this.personalDetails, this.$v)
      this.isFilled = true
    },
    edit () {
      if (this.isFilled) {
        this.$bus.$emit('checkout-before-edit', 'personalDetails')
        this.isFilled = false
      }
    },
    gotoAccount () {
      this.$bus.$emit('modal-show', 'modal-signup')
    }
  },
  created () {
    this.$bus.$on('user-after-loggedin', this.onLoggedIn)
  },
  destroyed () {
    this.$bus.$off('user-after-loggedin', this.onLoggedIn)
  }
}
