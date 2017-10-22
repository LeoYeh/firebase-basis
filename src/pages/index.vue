<template lang="pug">
div.test
  h1 上傳圖片
  hr
  h1 即時傳送
  hr
  h1 機器人驗證(visible)
    .g-recaptcha.g1
  hr
  h1 機器人驗證(invisible)
    form
      button(class="g-recaptcha g2"
        data-sitekey="6LcZBDUUAAAAALwAPRxBbr1zGhnyNARrnW-VGhq5"
        data-callback="onRecaptchaCb"
        data-size="invisible")
        | Submit
  hr
  h1 身分驗證
  #firebaseui-auth-container
  button(@click="onLogin" v-if="!utoken") login
  button(@click="onVerify" v-else) verify
</template>

<script>
// import functions from 'firebase-functions'
// import admin from 'firebase-admin'
import axios from 'axios'
import firebaseTool from '../assets/js/firebaseTool'

// var functions = require('firebase-functions')

export default {
  name: 'index',
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
    initReCaptcha() {
      grecaptcha.render(document.querySelector('.g1'), {
        sitekey: '6LcZBDUUAAAAALwAPRxBbr1zGhnyNARrnW-VGhq5',
        callback: (response) => {
          console.log('g1 token ', response)
        },
        'expired-callback': () => {
          console.log('g1 expired')
        },
      })
    },
    onLogin() {
      firebaseTool.initApp()
      var uiConfig = {
      // 這裡轉址 會被 router 轉回首頁
        signInSuccessUrl: `/#/totest?dt=${new Date().getTime()}`,
        signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        // firebase.auth.GithubAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
      // Terms of service url.
      // Mok 音樂
        tosUrl: 'https://www.youtube.com/watch?v=eFPES1EEdkk',
      }
    // console.log('auth ')
    // Initialize the FirebaseUI Widget using Firebase.
      var ui = new firebaseui.auth.AuthUI(firebase.auth())
    // The start method will wait until the DOM is loaded.
      ui.start('#firebaseui-auth-container', uiConfig)
    },
    onVerify() {
      firebaseTool.initApp()
      console.log(firebase.auth(), firebase.auth().currentUser)
      if (firebase.auth() && firebase.auth().currentUser) {
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then((idToken) => {
          // Send token to your backend via HTTPS
          // ...
          // console.log('idToken ', idToken)
          this.utoken = idToken
          this.validate(idToken)
        }).catch((error) => {
          // Handle error
          this.utoken = null
          // alert(`error ${error}`)
        })
      } else {
        console.log('not log in yet')
        this.utoken = null
      }
    },
    validate(token) {
      // cloud
      const path = 'https://us-central1-softpower-order-system.cloudfunctions.net/verify'
      // local
      // const path = 'http://localhost:5000/softpower-order-system/us-central1/verify'
      const header = new Headers({
        // 'Access-Control-Allow-Origin': '*',
        // 'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        'Content-Type': 'application/json',
      })
      const sentData = {
        method: 'post',
        mode: 'cors',
        header,
        body: JSON.stringify({ idToken: token }) || '',
      }
      fetch(path, sentData)
      .then(data => data.text())
      .then(str => JSON.parse(str))
      .then((rep) => {
        // console.log(JSON.stringify(rep))
        if (rep.result) {
          alert('user logined successful!')
        }
      })
      .catch((e) => {
        console.log(e)
      })
    },
  },
  created() {
    window.onRecaptchaCb = (token) => {
      // console.log('g2 token ', token)
      // cloud
      // const path = 'https://us-central1-softpower-order-system.cloudfunctions.net/checkRecaptcha'
      // local
      const path = 'http://localhost:5000/softpower-order-system/us-central1/checkRecaptcha'
      const header = new Headers({
        // 'Access-Control-Allow-Origin': '*',
        'Content-Type': 'multipart/form-data',
        // Accept: 'application/json',
        // 'Content-Type': 'application/json',
      })
      const sentData = {
        method: 'post',
        mode: 'cors',
        header,
        body: JSON.stringify({ token }) || '',
      }
      fetch(path, sentData)
      .then(data => data.text())
      .then(str => JSON.parse(str))
      .then((rep) => {
        // console.log(JSON.stringify(rep))
        if (rep.result) {
          alert(rep.msg)
        }
      })
      .catch((e) => {
        console.log(e)
      })
    }
  },
  mounted() {
    window.onloadRecapCallback = () => {
      grecaptcha.render(document.querySelector('.g2'), {
        sitekey: '6LcZBDUUAAAAALwAPRxBbr1zGhnyNARrnW-VGhq5',
      })
      // grecaptcha.execute()
      this.initReCaptcha()
    }
    //
    this.onVerify()
  },
}
</script>

<style lang="sass" scoped>
  .test
    padding-top: 30px
    p
      width: 100%
</style>