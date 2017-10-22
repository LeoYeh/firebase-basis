<template lang="pug">
div.index
  h1 {{rep}}
</template>

<script>
// import functions from 'firebase-functions'
// import admin from 'firebase-admin'
import axios from 'axios'
import * as types from '../assets/js/variables'
import firebaseTool from '../assets/js/firebaseTool'
import CookItem from '../components/CookItem.vue'

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
    cookItem: CookItem,
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
  sockets: {
    connect() {
      console.log('socket connected')
    },
    customEmit(val) {
      console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
    },
  },
  mounted() {
    // this.rep = this.getApi()
    console.log(this.$socket)
    this.$socket.on('fromServer', (msg) => {
      alert(`msg ${msg}`)
    })
    this.$socket.emit('fromServer', 'leo')
  },
}
</script>

<style lang="sass" scoped>
  .index
    padding-top: 30px
    p
      width: 100%
</style>