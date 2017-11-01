// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions')

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin')

admin.initializeApp(functions.config().firebase)

const cors = require('cors')

const rp = require('request-promise')

function helloFn2(req, res) {
  const json = JSON.parse(req.body)
  const idToken = json.idToken
  admin.auth().verifyIdToken(idToken)
  .then((decodedToken) => {
  // console.log('decode ', decodedToken)
    var uid = decodedToken.uid
    const rep = {
      result: true,
      uid,
    }
    res.status(200).send(rep)
  }).catch((error) => {
   // Handle error
    const rep = {
      result: false,
    }
    res.status(403).send(rep)
  })
}

function helloFn(req, res) {
  res.status(200).send({ uid: 12344444 })
}

function show(msg, res) {
  res.status(200).send(msg)
}

exports.verify = functions.https
.onRequest((req, res) => {
 // res.status(200).send(rep)
  var corsFn = cors()
  corsFn(req, res, () => {
   // helloFn(req, res)
    helloFn2(req, res)
   // show(req.body, res)
   // const json = JSON.parse(req.body)
   // console.log('json ', json.idToken)
   // const rep = {}
   // rep.result = true
   // rep.token = json.idToken
   // res.status(200).send(rep)
  })
})

function corsShow(req, res, msg) {
  const corsFn = cors()
  corsFn(req, res, () => {
    const rep = {}
    rep.result = true
    rep.msg = msg
    res.send(rep)
  })
}

exports.checkRecaptcha = functions.https.onRequest((req, res) => {
  const json = JSON.parse(req.body)
  const token = json.token
 // console.log('recaptcha response', rep.token)
  rp({
    uri: 'https://recaptcha.google.com/recaptcha/api/siteverify',
    method: 'POST',
    formData: {
      secret: '6LcZBDUUAAAAAA2D1beYQmQGQ6TJMKu4idPz3RvT',
      response: token,
    },
    json: true,
  }).then((result) => {
    if (result.success) {
      corsShow(req, res, "You're good to go, human.")
    } else {
      corsShow(req, res, 'Recaptcha verification failed. Are you a robot?')
    }
  }).catch((reason) => {
    corsShow(req, res, 'Recaptcha request failed.')
  })
})

/* 建立群推號碼 */
exports.newGp = functions.https.onRequest((req, res) => {
  const key = 'AAAAdiEmwHg:APA91bHJ68k6wi0YBO5xrxvThqk9yYhXeN3gQiDHTL_7_8ukwPdlgmQjmmDVfJqoDpMTUjRAcgZ1ozfJd-sB8cIHKpC_5d9V_uPL_oWW5kKuWDtX1ujcRcmmDf71T01iOA2XN9IJUBxD'
  // console.log('req ', req)
  const json = req.body
  const name = json.name
  const iid = json.iid
  // console.log('json ', json)
  // corsShow(req, res, name)

  const data = {}
  data.operation = 'create'
  data.notification_key_name = name
  data.registration_ids = [iid]

  rp({
    uri: 'https://android.googleapis.com/gcm/notification',
    method: 'POST',
    headers: {
      Authorization: `key=${key}`,
      'Content-Type': 'application/json',
      project_id: '507362328696',
    },
    body: data,
    json: true,
  }).then((result) => {
    corsShow(req, res, result)
  }).catch((err) => {
    corsShow(req, res, err)
  })
})

/* 新增群推號碼 */
exports.newGp = functions.https.onRequest((req, res) => {
  const key = 'AAAAdiEmwHg:APA91bHJ68k6wi0YBO5xrxvThqk9yYhXeN3gQiDHTL_7_8ukwPdlgmQjmmDVfJqoDpMTUjRAcgZ1ozfJd-sB8cIHKpC_5d9V_uPL_oWW5kKuWDtX1ujcRcmmDf71T01iOA2XN9IJUBxD'
  // console.log('req ', req)
  const json = req.body
  const name = json.name
  const iid = json.iid
  // console.log('json ', json)
  // corsShow(req, res, name)

  const data = {}
  data.operation = 'create'
  data.notification_key_name = name
  data.registration_ids = [iid]

  rp({
    uri: 'https://android.googleapis.com/gcm/notification',
    method: 'POST',
    headers: {
      Authorization: `key=${key}`,
      'Content-Type': 'application/json',
      project_id: '507362328696',
    },
    body: data,
    json: true,
  }).then((result) => {
    corsShow(req, res, result)
  }).catch((err) => {
    corsShow(req, res, err)
  })
})
