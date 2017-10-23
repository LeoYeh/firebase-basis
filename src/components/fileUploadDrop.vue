<template>
 <div class="file-upload-drop">
   <div class="file-upload-drop-btn file-upload-drop-item" @click="onFileUpload">
     <input 
       type="file" 
       id="fileUploadDrop" 
       accept=".pdf,.txt,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.key,.gif" 
       style="display: none"
       @change="onFileUploaded($event)">
     <p class="sub2">選擇需要的檔案上傳<br><span>僅限上傳30MB</span></p>
     <div class="icon arw" :class="{loaded:uploads.length > 0}"></div>
   </div>
   <transition-group name="slide-down" class="slide-down-transition-group" tag="div">
     <div class="file-upload-drop-list" key="dropdown">
       <div 
         class="file-upload-drop-item file" 
         v-for="(item, index) in uploads" 
         @click="onDel(item, index)"
         :key="index">
         <p class="sub2"><span class="fname">{{item.name}}</span><span class="fsize">{{item.size|fileFmt}}</span></p>
         <div class="icon trash-can empty"></div>
       </div>
     </div>
   </transition-group>
 </div>
</template>
<script>
export default {
  props: {
  },
  data() {
    return {
      uploads: [],
      image: null,
    }
  },
  created() {
   // console.log(JSON.stringify(this.uploads));
   // this.uploads = this.filesList;
  },
  computed: {
   // uploads() {
   //   const arr = this.filesList || []
   //   return arr.slice(0, 5)
   // },
  },
  watch: {
  },
  methods: {
    onFileUpload() {
      document.getElementById('fileUploadDrop').value = ''
      document.getElementById('fileUploadDrop').click()
    },
    onFileUploaded(e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        alert('上傳失敗')
        return
      }
      this.createItem(files[0])
    },
    createItem(file) {
      const fname = file.name.toLowerCase()
      const isImg = /[.jpg|.jpeg|.png]$/.test(fname)
      const isDoc = /[.doc|.docx|.xls|.xlsx|.txt|.pdf]$/.test(fname)
      const isMusic = /[.mp3|.mp4]$/.test(fname)
      if (!isImg && !isDoc && !isMusic) {
        alert('檔案格式錯誤')
        return
      }

      if (file.size > 30 * 1000 * 1000) {
        alert('檔案超過 30 MB，請重新選擇')
      }

     // this.total = this.total + file.size
     // if (this.total > 50 * 1000 * 1000) {
     //   alert("僅限上傳50MB");
     //   return;
     // }
   //   this.uploads.push(file)
      this.$emit('onAdd', file)
    },
    removeImage(e) {
      this.image = ''
    },
    onDel(item, pos) {
   //   this.$emit('onDel', pos)
    },
  },
}
</script>
<style lang="sass">
</style>
