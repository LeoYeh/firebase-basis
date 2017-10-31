<template lang="pug">
div.index
 .inner
    h1 機器人驗證(invisible)
      form
        button(class="g-recaptcha g2"
          data-sitekey="6LcZBDUUAAAAALwAPRxBbr1zGhnyNARrnW-VGhq5"
          data-callback="onRecaptchaCb"
          data-size="invisible")
          | Submit
    hr
    h1 身分驗證
    #loader
    #firebaseui-auth-container
    p(v-if="uname") 歡迎登入{{uname}}
    button(@click="onLogin" v-if="!utoken") login
    //- button(@click="onVerify" v-if="utoken") verify
    button(@click="onLogout" v-if="utoken") logout
    hr
    h1 上傳圖片
    //- input#finput(type="file" name="file" @change="onFileUploaded($event)")
    //- input#ftext(v-model="fname")
    //- button(@click="onUpload") 上傳
    a(:href="image" target="_blank")
      p {{image}}
      img(:src="image" v-if="image" style="width:300px")
    fUpload(@onAdd="onAdd")
    hr
    h4 realtime-database 即時傳送
    .chat-room
      .col.ctl
        input#ctxt(@keyup.enter="onSend" v-model="msg") 
        button#cbtn(@click="onSend") send
      .col.view
        ul
          li(v-for="item in list") {{item}}
    //- hr
    //- h1 同步更新
    //- .sync-room
    //-   .col
    //-     input#stxt(@keyup.enter="onSendSync" v-model="smsg") 
    //-     button#sbtn(@click="onSendSync") send
    //-   .col
    //-     ul
    //-       li(v-for="item in slist") {{item}}
    hr
    h1 發送通知
    p 權證 
    input(v-model="iid")
    button(@click="onSendFcmMsg") 發送通知
</template>

<script>
// import functions from 'firebase-functions'
// import admin from 'firebase-admin'
import axios from 'axios'

import firebaseTool from '../assets/js/firebaseTool'
// import imgEditor from '../../static/js/imgEditor'
import fUpload from '../components/fileUploadDrop.vue'

// var functions = require('firebase-functions')

export default {
  name: 'index',
  data() {
    return {
      rep: '',
      utoken: '',
      file: null,
      image: '',
      list: [],
      uname: '',
      msg: '',
      smsg: '',
      slist: [],
      iid: '',
    }
  },
  computed: {
  },
  components: {
    fUpload,
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
    onLogout() {
      this.uname = ''
      firebaseTool.logout()
      location.reload()
    },
    onLogin() {
     // const path = '../static/auth/login.html'
      const path = '/#/signup'
      window.open(path, 'Sign In', 'width=985,height=735')
    },
    onVerify() {
      const auth = firebase.auth()
      // console.log(auth, auth.currentUser)
      if (auth && auth.currentUser) {
        this.uname = auth.currentUser.email.split('@')[0]
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then((idToken) => {
         // Send token to your backend via HTTPS
          this.utoken = idToken
          this.validate(idToken)
        }).catch((error) => {
         // Handle error
          this.utoken = null
         // alert(`error ${error}`)
        })
      } else {
        // console.log('not log in yet')
        this.utoken = null
      }
    },
    validate(token) {
      const path = 'https://us-central1-test-ec76b.cloudfunctions.net/verify'
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
         console.log('user logined successful!')
         // alert('user logined successful!')
       }
     })
     .catch((e) => {
       console.log(e)
     })
    },
    checkAuth() {
      setTimeout(() => {
        console.log('firebase.auth().currentUser ', firebase.auth().currentUser)
        if (!firebase.auth().currentUser) {
          this.checkAuth()
        }
      }, 1 * 1000)
    },
    toBlob(file) {
      imgEditor.loadImg(file, (canvas) => {
       // console.log('canvas ', canvas)
       // const b64 = canvas.toDataURL('image/png')
       // const blob = imgEditor.base64ToBlob(b64)
        canvas.toBlob(
         (blob) => {
           // Do something with the blob object,
           // e.g. creating a multipart form for file uploads:
           const fileName = 'file'
           var formData = new FormData()
           formData.append('file', blob, fileName)
             /* ... */
          //  console.log(blob)
         }, 'image/jpeg')
       // console.log('b64 ', b64)
      }, true)
    },
    onAdd(file) {
     // console.log('file ', file)
      firebaseTool.initApp()
      firebaseTool.uFile(file)
        .then((rep) => {
          this.image = rep.downloadURL
        })
    },
    // 聊天區
    onSend() {
      // console.log('onsend')
      if (this.msg.length > 0) {
        const newPostKey = firebase.database().ref().push().key
        const update = {}
        update[`chat/${newPostKey}`] = this.msg

        firebase.database().ref().update(update, (rep) => {
          this.msg = ''
        // if (cb)cb(rep)
        })
      } else {
        alert('請輸入文字！')
      }
    },
    initChat() {
      const starCountRef = firebase.database().ref('chat').limitToLast(3)
      starCountRef.on('value', (rep) => {
        // const obj = Object.assign({}, rep)
        // console.log('obj =>', JSON.stringify(obj))
        const obj = JSON.parse(JSON.stringify(rep))
        // console.log(obj['-KxBsU3u7vIHB-5h--a9'])
        // console.log(obj['-KxBaMR3MEci_y47wXB8'])
        this.list = []
        Object.entries(obj).forEach(([key, v]) => {
          // console.log(v)
          // this.list = [...this.list, v]
          this.list.push(v)
        })
        this.list.reverse()
        // console.log(this.list)
      })
    },
    // fireStore
    onSendSync() {
      var db = firebase.firestore()
      // 使用 亂數 新增
      db.collection('list').add({ msg: this.smsg })
      .then((docRef) => {
        console.log('Document written with ID: ', docRef.id)
        this.smsg = ''
      })
      .catch((error) => {
        console.error('Error adding document: ', error)
      })
      // 更新 item 文件
      // const ref = db.collection('list').doc('item')
      // ref.set({ msg: this.smsg })
    },
    initDb() {
      var db = firebase.firestore()
      this.slist = []
      db.collection('list').limit(3)
      .onSnapshot((doc) => {
        // console.log('Current data: ', doc)
        doc.docChanges.forEach((change) => {
          // console.log(`User ${change.doc.msg} is now online.`)
          if (change.type === 'added') {
            this.slist.push(change.doc.data().msg)
            // console.log(`User ${change.doc.data().msg} is now online.`)
          }
          // if (change.type === 'removed') {
          //   console.log(`User ${change.doc.msg} has gone offline.`)
          // }
        })
        this.slist.reverse()
        this.slist = this.slist.slice(0, 3)
      })
    },
    onSendFcmMsg() {
      var key = 'AAAAdiEmwHg:APA91bHJ68k6wi0YBO5xrxvThqk9yYhXeN3gQiDHTL_7_8ukwPdlgmQjmmDVfJqoDpMTUjRAcgZ1ozfJd-sB8cIHKpC_5d9V_uPL_oWW5kKuWDtX1ujcRcmmDf71T01iOA2XN9IJUBxD'
      var to = this.iid
      var notification = {
        title: 'Portugal vs. Denmark',
        body: '5 to 1',
        icon: 'firebase-logo.png',
        click_action: 'http://localhost:8081',
      }

      fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          Authorization: `key=${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notification,
          to,
        }),
      }).then((response) => {
        console.log(response)
        // alert(response)
      }).catch((error) => {
        console.error(error)
      })
    },
  },
  created() {
    // 驗證碼 後端認證
    window.onRecaptchaCb = (token) => {
     // console.log('g2 token ', token)
     // local
      const path = 'https://us-central1-test-ec76b.cloudfunctions.net/checkRecaptcha'
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
    const href = window.location.href
    window.onloadRecapCallback = () => {
      grecaptcha.render(document.querySelector('.g2'), {
        sitekey: '6LcZBDUUAAAAALwAPRxBbr1zGhnyNARrnW-VGhq5',
      })
      // grecaptcha.execute()
      // this.initReCaptcha()
    }
    //
    firebaseTool.initApp()
    setTimeout(() => {
      this.onVerify()
    }, 0.5 * 1000)
    this.initChat()
    this.initDb()
  },
}
</script>

<style lang="sass" scoped>
  .index
    display: flex
    justify-content: center
    // align-items: center
    width: 100%
    height: 100%
    // border: solid 1px black
    // border-radius: 10px
    .inner
      padding: 15px
      width: 400px
      h1
        align: center
        .g1
          display: inline-block
      .chat-room
        display: flex
        input
          width: 80px
        .col
          width: 50%
      .sync-room
        display: flex
        input
          width: 80px
        .col
          width: 50%
</style>