

/* 編輯圖片相關 */
var imgEditor = (function () {
  function imgEditor() {
    console.log('imgEditor')
  }
  /* 讀取照片 並 考慮 圖片 data.exif 參數 */
  imgEditor.loadImg = function (file, cb, getCanvas) {
    loadImage.parseMetaData(file, (data) => {
      if (data.imageHead || true) {
        var option = {}
        option['maxWidth'] = 1024
        option['maxHeight'] = 1024
        option['canvas'] = false
        option.canvas = getCanvas || false
        var degree = (data.exif) ? parseInt(data.exif.get('Orientation'), 10) : 0
        option['orientation'] = degree
        loadImage(file, (rep) => {
          var maxWidth = 650,
            maxHeight = 650
          var $rep = rep
          var ww = $rep.width
          var hh = $rep.height
          if (ww > hh) {
            // $rep.style = 'position:absolute; width:' + maxWidth + '; height:auto;';
            $rep.style.position = 'absolute'
            $rep.style.width = maxWidth
            $rep.style.height = 'auto'
          } else {
            // $rep.style = 'position:absolute; height:' + maxHeight + '; width:auto;';
            $rep.style.position = 'absolute'
            $rep.style.width = maxWidth
            $rep.style.height = 'auto'
          }

          if (!getCanvas) {
            if (rep && rep.src) {
              var img = rep
              if (cb) {
                cb(img)
              }
            } else {
              var canvas = rep
              var pimg = new Image()
              pimg.onload = function () {
                if (cb) { cb(pimg) }
              }
              pimg.src = canvas.toDataURL('image/png')
            }
            // 需要使用 blob url show img 才用
          } else if (cb) {
            cb(rep)
          }
        }, option)
      }
    })
  }
  /* base64 to blob */
  imgEditor.base64ToBlob = function (bs64) {
    function b64toBlob(b64Data, contentType, sliceSize) {
      contentType = contentType || ''
      sliceSize = sliceSize || 512
      // console.log(b64Data);
      var byteCharacters = atob(b64Data)
      var byteArrays = []
      for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize)
        var byteNumbers = new Array(slice.length)
        for (var i = 0; i < slice.length; i += 1) {
          byteNumbers[i] = slice.charCodeAt(i)
        }
        var byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
      }
      var blob = new Blob(byteArrays, { type: contentType })
      return blob
    }
    return b64toBlob(bs64, 'image/png', 512)
  }
  // ////////////////////////////////////////////////////////////////////////////////////////
  // base 64
  // ////////////////////////////////////////////////////////////////////////////////////////
  /* img to bs64 */
  /* param 可為任何 img.src = http://*.domain, blob:, base64,
   */
  imgEditor.img2bs64 = function (param, withTitle, cb) {
    var url = (typeof (param) === 'string') ? param : param.src
    var img
    var onLoad = function () {
      var canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      var ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      var dataURL = canvas.toDataURL('image/png')
      $(canvas).remove()
      var b64 = (withTitle) ? dataURL : dataURL.replace(/^data:image\/(png|jpg);base64,/, '')
      if (cb) { cb(b64) }
    }
    if (url.indexOf('blob:') > -1) {
      img = param
      onLoad()
    } else {
      img = new Image()
      img.onload = onLoad
      img.src = url
    }
  }
  imgEditor.b64ToImg = function (b64, cb) {
    // console.log(b64.slice(0, 10));
    var path = (b64.indexOf('data:') > -1) ? b64 : `data:image/png;base64,${b64}`
    var img = new Image()
    img.onload = function () {
      if (cb) { cb(img) }
    }
    img.src = path
  }


  // ////////////////////////////////////////////////////////////////////////////////////////
  // blob
  // ////////////////////////////////////////////////////////////////////////////////////////
  // dataURL 轉成 blob
  imgEditor.url2Blob = function (dataURI, cb) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString
    if (dataURI.split(',')[0].indexOf('base64') >= 0) { byteString = atob(dataURI.split(',')[1]) } else { byteString = unescape(dataURI.split(',')[1]) }

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length)
    for (var i = 0; i < byteString.length; i += 1) {
      ia[i] = byteString.charCodeAt(i)
    }

    if (cb) cb(new Blob([ia], { type: mimeString }))
  }

  imgEditor.img2Blob = function (url, cb) {
    var me = this
    this.img2bs64(url, false, (b64) => {
      var blob = me.base64ToBlob(b64)
      if (cb) { cb(blob) }
    })
    // imgEditor.url2Blob(rul, cb);
  }
  /* blob to img */
  imgEditor.blob2img = function (blob) {
    var newImg = document.createElement('img'),
      url = URL.createObjectURL(blob)
    newImg.onload = function () {
      URL.revokeObjectURL(url)
    }
    newImg.src = url
    return newImg
  }
  return imgEditor
}())
// # sourceMappingURL=imgEditor.js.map
