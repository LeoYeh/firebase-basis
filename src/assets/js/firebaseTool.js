// const firebase = require('firebase')
// const firebaseui = require('firebaseui')

export default {
  initApp() {
    if (!firebase.apps.length) {
      const config = {
        apiKey: 'AIzaSyCYW4FsBwYM9iP8NVtv2rhtQu_Vdk5nfGE',
        authDomain: 'test-ec76b.firebaseapp.com',
        databaseURL: 'https://test-ec76b.firebaseio.com',
        projectId: 'test-ec76b',
        storageBucket: 'test-ec76b.appspot.com',
        messagingSenderId: '507362328696',
      }
      firebase.initializeApp(config)
    }
  },
  // Login
  login(cb) {
    // console.log('login ')
    // FirebaseUI config.
    const uiConfig = {
      // 這裡轉址 會被 router 轉回首頁
      signInSuccessUrl: '/',
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        // firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // {
        //   provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        //   requireDisplayName: true,
        // },
      ],
      // callbacks: {
      //   signInSuccess(currentUser, credential, redirectUrl) {
      //     // Do something.
      //     // Return type determines whether we continue the redirect automatically
      //     // or whether we leave that to developer to handle.
      //     console.log('success')
      //     return true
      //   },
      //   uiShown() {
      //     // The widget is rendered.
      //     // Hide the loader.
      //     console.log('uiShown')
      //     document.getElementById('loader').style.display = 'none'
      //     // console.log('loader none')
      //   },
      // },
      // credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM,
      // queryParameterForWidgetMode: 'mode',
      // queryParameterForSignInSuccessUrl: 'signInSuccessUrl',
      signInFlow: 'popup',
      // Terms of service url.
      // Mok 音樂
      tosUrl: 'https://www.youtube.com/watch?v=eFPES1EEdkk',
    }
    // Initialize the FirebaseUI Widget using Firebase.
    const ui = new firebaseui.auth.AuthUI(firebase.auth())
    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig)
    /* with auth */
  },
  logout() {
    this.initApp()
    firebase.auth().signOut().then(() => {
      console.log('Signed Out')
    }, (error) => {
      console.error('Sign Out Error', error)
    })
  },
  checkUser(cb) {
    firebase.auth().onAuthStateChanged((user) => {
      console.log('user ', user)
      if (user) {
        console.log('user ', user)
        // console.log('user ', user.uid)
        const rep = /(hrZPH3k9TbcG2x52g2NnSQ6fVGx2|GwW6fb1RJWakaMZ7RCKrEchDP212)/.test(user.uid)
        // this.$vm.data = { token: rep }
        // console.log('rep ', rep)
        if (rep) {
          window.token = user.uid
          cb(true)
        } else {
          cb(false)
        }
      } else if (cb) {
        cb(false)
        // location.replace('https://leoyehsblog.blogspot.tw/')
      }
    })
  },
  addFile(file) {
    this.initApp()
    // new post
    const newPostKey = firebase.database().ref().push().key
    // const updates = {}
    // return new Promis((resolve, reject) => {
    //   firebase.database().ref().update(updates, (rep) => {
    //     // console.log('rep ', JSON.stringify(rep))
    //     if (cb)cb(rep)
    //   })
    // })
  },
  uFile(file) {
    const newPostKey = firebase.database().ref().push().key
    // console.log('key ', newPostKey)
    // Create a root reference
    var storageRef = firebase.storage().ref()
    const type = file.name.split('.')[1]
    const rename = `${newPostKey}.${type}`
    // console.log('rename ', rename)
    // Create a reference to 'mountains.jpg'
    var ref = storageRef.child(rename)

    // Create a reference to 'images/mountains.jpg'
    // var mountainImagesRef = storageRef.child(`images/${file.name}`)

    // While the file names are the same, the references point to different files
    // mountainsRef.name === mountainImagesRef.name            // true
    // mountainsRef.fullPath === mountainImagesRef.fullPath    // false
    // console.log(file)
    // difference file name
    return new Promise((resolve, reject) => {
      ref.put(file).then((rep) => {
        // console.log(rep)
        // this.image = rep.downloadURL
        resolve(rep)
        // console.log(`Uploaded a blob or file! ${JSON.stringify(snapshot)}`)
      }).catch((e) => {
        reject(e)
      })
    })
  },
  // live-stream-database
  // getDbPath
  getPath(dstr) {
    const dt = (!dstr) ? new Date() : new Date(dstr)
    const today = `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`
    // console.log('today ', today)
    const rep = `history/${today}`
    // console.log('firetool path rep ', rep)
    return rep
  },
  // 送表單
  postList(list, cb) {
    this.initApp()
    // new post
    const newPostKey = firebase.database().ref().child('posts').push().key
    const updates = {}
    // console.log(JSON.stringify(list))
    const arr = list.map((item) => {
      const obj = item
      /* 加入 */
      /* 建立時間 */
      obj.createdTime = firebase.database.ServerValue.TIMESTAMP
      /* 出餐進度, waiting, done, cancel */
      obj.process = types.PROCESS_WAITING
      return obj
    })
    updates[`${this.getPath()}/${newPostKey}`] = arr
    // console.log('send')
    firebase.database().ref().update(updates, (rep) => {
      // console.log('rep ', JSON.stringify(rep))
      if (cb)cb(rep)
    })
  },
  // 抓單子
  loadList(dt, cb) {
    this.initApp()
    const path = this.getPath(dt)
    /* for mapping db path */
    const dd = new Date(dt)
    const dstr = `${dd.getFullYear()}-${dd.getMonth() + 1}-${dd.getDate()}`
    // console.log('dt ', dt)
    const starCountRef = firebase.database().ref(path)
    starCountRef.on('value', (obj) => {
      const rep = obj.val()
      if (rep) {
        const arr = []
        Object.entries(rep).forEach(([key, set]) => {
          Object.entries(set).forEach(([id, item]) => {
            // console.log(key, set, id, vitem)
            item.spath = `history/${dstr}/${key}/${id}/process`
          })
          arr.push(set)
        })
        // console.log(JSON.stringify(arr))
        if (cb) cb(arr.reverse())
      } else {
        console.log('無資料')
        // throw new Error('無資料')
      }
    })
  },
  // 更新餐點狀態
  updateOrderStatus(status, spath, cb) {
    console.log(status, spath)
    this.initApp()
    const updates = {}
    updates[`${spath}`] = status
    // console.log('send')
    firebase.database().ref().update(updates, (rep) => {
      if (cb)cb(rep)
    })
  },
}
