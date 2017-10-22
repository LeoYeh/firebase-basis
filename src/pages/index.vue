<template lang="pug">
div.test
  h1 {{rep}}
</template>

<script>
// import functions from 'firebase-functions'
// import admin from 'firebase-admin'
import axios from 'axios'
import firebaseTool from '../assets/js/firebaseTool'

// var functions = require('firebase-functions')

export default {
  name: 'test',
  data() {
    return {
      rep: '',
    }
  },
  computed: {
  },
  components: {
  },
  watch: {
  },
  methods: {
    getApi() {
      return new Promise((resolve, reject) => {
        axios.post('https://us-central1-softpower-order-system.cloudfunctions.net/ok', {})
          .then((json) => {
            resolve(json.data)
          })
          .then((rep) => {
            console.log('rep ', rep)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
  },
  mounted() {
  },
}
</script>

<style lang="sass" scoped>
  .test
    padding-top: 30px
    p
      width: 100%
</style>