<template lang="pug">
div.signup
 .inner
   #loader
   #firebaseui-auth-container
</template>

<script>
// import functions from 'firebase-functions'
// import admin from 'firebase-admin'
import axios from 'axios'
import firebaseTool from '../assets/js/firebaseTool'

// var functions = require('firebase-functions')

export default {
  name: 'signup',
  data() {
    return {
      rep: '',
      utoken: '',
    }
  },
  computed: {
  },
  components: {
  },
  watch: {
  },
  methods: {
    onLogout() {
      firebaseTool.logout()
      location.reload()
    },
    onLogin() {
      firebaseTool.login()
    },
    onVerify() {
    },
    validate(token) {
    },
    checkAuth() {
    },
  },
  created() {
  },
  mounted() {
    firebaseTool.initApp()
    this.onLogin()
  },
}
</script>

<style lang="sass" scoped>
 .signup
   padding-top: 30px
   display: flex
   justify-content: center
</style>