<template>
  <div class="retrieval-wrapper">
    <v-header :title="title"></v-header>
    <div class="retrieve" v-loading.fullscreen.lock="loading" element-loading-text="Retrieving..." element-loading-background="rgb(255, 255, 255)" style="z-index: 10;">
      <div class="steps-wrapper">
        <el-steps :active="active">
          <el-step v-for="(step, index) in stepData" :key="index" :title="step.title" :icon="step.icon" @click.native="changeStep(index)"></el-step>
        </el-steps>
      </div>
      <div class="views-wrapper">
        <el-row v-show="active === 0" class="step">
          <div class="image-wrapper">
            <div class="box_cloth">
              <div class="cloth_panel_select" id="cloth_panel_select" @click="uploadCloth">
                <input type="radio" class="select" value="0" id="cloth_select_0">
                <p id="cloth_label">Upload image</p>
                <input id="selected_file_cloth_image" @change="changeCloth" type="file" accept="image/*">
                <canvas id="selected_file_cloth_image_canvas" width="256" height="256"></canvas>
              </div>
            </div>
          </div>
          <div class="button-wrapper">
            <div class="btns">
              <i class="el-icon-arrow-left prev" @click="prev()" v-show="active !== 0"></i>
              <i class="el-icon-arrow-right next" @click="next()" v-show="active !== stepData.length - 1"></i>
            </div>
          </div>
        </el-row>
        <el-row v-show="active === 1" class="step">
          <div class="box_retrieval">
            <canvas id="retrieved_image_1_canvas" width="256" height="256"></canvas>
            <canvas id="retrieved_image_2_canvas" width="256" height="256"></canvas>
            <canvas id="retrieved_image_3_canvas" width="256" height="256"></canvas>
            <canvas id="retrieved_image_4_canvas" width="256" height="256"></canvas>
            <canvas id="retrieved_image_5_canvas" width="256" height="256"></canvas>
          </div>
          <div class="button-wrapper">
            <div class="btns">
              <i class="el-icon-arrow-left prev" @click="prev()" v-show="active !== 0"></i>
              <i class="el-icon-arrow-right next" @click="next()" v-show="active !== stepData.length - 1"></i>
            </div>
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'
  import Service from '@/services/services'
  import awsApis from '@/services/gpu'
  import VHeader from '@/components/front/v-header/v-header'
  import { mapGetters } from 'vuex'
  import statusCode from '@/common/js/status'

  export default {
    data () {
      return {
        title: 'Outfit Retrieval',
        loading: false,
        apiUrl: awsApis.retrieval,
        active: 0,
        user: {},
        stepData: [{
          index: 0,
          title: 'Step 1',
          icon: 'el-icon-upload'
        }, {
          index: 1,
          title: 'Step 2',
          icon: 'el-icon-picture'
        }],
        clothImg: null
      }
    },
    created() {
      this._initializeUser()
    },
    computed: {
      ...mapGetters([
        'account'
      ])
    },
    methods: {
      _initializeUser() {
        let query = this.account.username
        let type = statusCode.USERNAME
        Service.getOneUser(type, query)
          .then((response) => {
            let res = response.data
            if (res.code === statusCode.ERR_OK) {
              this.user = res.data[0]
            }
          })
      },
      changeStep(index) {
        this.active = index
      },
      prev() {
        let curIndex = this.active
        if (curIndex > 0) {
          this.active = curIndex - 1
        }
      },
      next() {
        let curIndex = this.active
        if (curIndex < this.stepData.length - 1) {
          this.active = curIndex + 1
        }
        if (curIndex + 1 === 1) {
          this.loading = true
          this.retrieveOutfits(this.apiUrl)
        }
      },
      getLabel(mode, index) {
        return `${mode}_select_${index + 1}`
      },
      getImageLabel(mode, index) {
        return `${mode}_image_${index + 1}`
      },
      drawToCanvas(imgSrc, canvasId) {
        var img = new Image()
        img.src = imgSrc
        img.onload = function() {
          var canvas = document.getElementById(canvasId)
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight
          var context = canvas.getContext('2d')
          context.drawImage(img, 0, 0, canvas.width, canvas.height)
        }
      },
      convImageToBase64(img, mimeType) {
        // New Canvas
        var canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        // Draw Image
        var context = canvas.getContext('2d')
        context.drawImage(img, 0, 0, canvas.width, canvas.height)
        // To Base64
        return canvas.toDataURL(mimeType)
      },
      uploadCloth() {
        document.getElementById('selected_file_cloth_image').click()
      },
      changeCloth(e) {
        let it = this
        var reader = new FileReader()
        if (e.target.files.length > 0) {
          reader.readAsDataURL(e.target.files[0])
          let width
          let height
          reader.onload = function (e) {
            let imgSrc = e.target.result
            var image = new Image()
            image.src = imgSrc
            image.onload = function() {
              width = this.width
              height = this.height
              width = 8 + width
              height = 8 + height
              document.getElementById('cloth_panel_select').style.width = `${width}px`
              document.getElementById('cloth_panel_select').style.height = `${height}px`
            }
            it.drawToCanvas(imgSrc, 'selected_file_cloth_image_canvas')
          }
          document.getElementById('cloth_label').style.display = 'none'
          setTimeout(() => {
            this.clothImg = document.getElementById('selected_file_cloth_image_canvas').toDataURL('image/png').replace(/^.*,/, '')
          }, 1000)
        }
      },
      retrieveOutfits(apiUrl) {
        if (this.clothImg === null) {
          setTimeout(() => {
            this.loading = false
          }, 1000)
          return
        }
        var clothImgBase64 = this.clothImg
        try {
          axios.post(apiUrl, {
            'img_base64': clothImgBase64
          })
            .then((res) => {
              let retrievedImgs = res.data.retrieved_imgs
              for (let i = 0; i < retrievedImgs.length; i++) {
                let canvasId = `retrieved_image_${i + 1}_canvas`
                let dataURL = `data:image/png;base64,${retrievedImgs[i]}`
                this.drawToCanvas(dataURL, canvasId)
              }

              let retrieval = {
                '_id': this.user._id,
                'username': this.user.username,
                'cloth': clothImgBase64,
                'results': retrievedImgs
              }
              Service.addRetrieval(retrieval)
                .then((response) => {
                  console.log(response)
                })
              setTimeout(() => {
                this.loading = false
              }, 1000)
            })
            .catch((err) => {
              console.log('Something wrong happened in the api server.', err)
              setTimeout(() => {
                this.loading = false
              }, 1000)
            })
        } catch (e) {
          console.error(e)
        }
      }
    },
    components: {
      VHeader
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .retrieve
    position: relative
    .steps-wrapper
      position: relative
      width: 90%
      margin: 0 auto
      margin-top: 20px
    .views-wrapper
      text-align: center
      margin-top: 60px
      .step
        .image-wrapper
          width: 90%
          margin: 0 auto
          display: flex
          justify-content: center
          .select
            display: none
          .box_pose, .box_cloth
            position: relative
            .cloth_panel_select
              position: relative
              width: 264px
              height: 264px
              line-height: 264px
              border: 4px lightblue solid
              #selected_file_cloth_image
                display: none
                height: 100%
                width: 100%
                position: relative
        .button-wrapper
          margin-top: 20px
          padding: 30px
          .btns
            position: relative
            font-size: 36px
            .prev
              position: fixed
              top: 50%
              left: 0
            .next
              position: fixed
              top: 50%
              right: 0
</style>
