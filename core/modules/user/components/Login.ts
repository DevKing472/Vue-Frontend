import i18n from '@vue-storefront/i18n'

export const Login = {
  name: 'Login',
  data () {
    return {
      remember: false,
      email: '',
      password: ''
    }
  },
  methods: {
    close () {
      // TODO Move to theme
      this.$bus.$emit('modal-hide', 'modal-signup')
    },
    callLogin () {
      this.$bus.$emit('notification-progress-start', i18n.t('Authorization in progress ...'))
      this.$store.dispatch('user/login', { username: this.email, password: this.password }).then((result) => {
        this.$bus.$emit('notification-progress-stop', {})

        if (result.code !== 200) {
          this.onFailure(result)
        } else {
          this.onSuccess()
          this.close()
        }
      }).catch(err => {
        console.error(err)
        // TODO Move to theme
        this.$bus.$emit('notification-progress-stop')
      })
    },
    switchElem () {
      // TODO Move to theme
      this.$store.commit('ui/setAuthElem', 'register')
    },
    callForgotPassword () {
      // TODO Move to theme
      this.$store.commit('ui/setAuthElem', 'forgot-pass')
    }
  }
}
