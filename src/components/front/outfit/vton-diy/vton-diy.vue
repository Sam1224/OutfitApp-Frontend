<template>
  <div class="virtual-try-on-diy-wrapper">
    <v-header :title="title"></v-header>
    <div class="vton-diy" v-loading.fullscreen.lock="loading" element-loading-text="Generating..." element-loading-background="rgb(255, 255, 255)">
      <div class="steps-wrapper">
        <el-steps :active="active">
          <el-step v-for="(step, index) in stepData" :key="index" :title="step.title" :icon="step.icon" @click.native="changeStep(index)"></el-step>
        </el-steps>
      </div>
      <div class="views-wrapper">
        <el-row v-show="active === 0" class="step">
          <div class="image-wrapper">
            <div class="box_pose">
              <div class="pose_panel_select" @click="uploadPose">
                <input type="radio" class="select" value="0" id="pose_select_0">
                <p id="pose_label">Upload pose image</p>
                <input id="selected_file_pose_image" @change="changePose" type="file" accept="image/*">
                <canvas id="selected_file_pose_image_canvas" width="192" height="256"></canvas>
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
          <div class="image-wrapper">
            <div class="box_cloth">
              <div class="cloth_panel_select" @click="uploadCloth">
                <input type="radio" class="select" value="0" id="cloth_select_0">
                <p id="cloth_label">Upload cloth image</p>
                <input id="selected_file_cloth_image" @change="changeCloth" type="file" accept="image/*">
                <canvas id="selected_file_cloth_image_canvas" width="192" height="256"></canvas>
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
        <el-row v-show="active === 2" class="step">
          <div class="box_tryon">
            <canvas id="tryon_image_canvas" width="192" height="256"></canvas>
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
  import awsApis from '@/services/gpu'
  import VHeader from '@/components/front/v-header/v-header'

  export default {
    data () {
      return {
        title: 'Virtual Try-On DIY',
        loading: false,
        apiUrl: awsApis.vton,
        active: 0,
        stepData: [{
          index: 0,
          title: 'Step 1',
          icon: 'el-icon-upload'
        }, {
          index: 1,
          title: 'Step 2',
          icon: 'el-icon-upload'
        }, {
          index: 2,
          title: 'Step 3',
          icon: 'el-icon-picture'
        }],
        poseImg: null,
        clothImg: null
      }
    },
    methods: {
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
        if (curIndex + 1 === 2) {
          this.loading = true
          this.generateTryOnImage(this.apiUrl)
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
      uploadPose() {
        document.getElementById('selected_file_pose_image').click()
      },
      uploadCloth() {
        document.getElementById('selected_file_cloth_image').click()
      },
      changePose(e) {
        let it = this
        var reader = new FileReader()
        if (e.target.files.length > 0) {
          reader.readAsDataURL(e.target.files[0])
          reader.onload = function (e) {
            let imgSrc = e.target.result
            it.drawToCanvas(imgSrc, 'selected_file_pose_image_canvas')
          }
          document.getElementById('pose_label').style.display = 'none'
          setTimeout(() => {
            this.poseImg = document.getElementById('selected_file_pose_image_canvas').toDataURL('image/png').replace(/^.*,/, '')
          }, 1000)
        }
      },
      changeCloth(e) {
        let it = this
        var reader = new FileReader()
        if (e.target.files.length > 0) {
          reader.readAsDataURL(e.target.files[0])
          reader.onload = function (e) {
            let imgSrc = e.target.result
            it.drawToCanvas(imgSrc, 'selected_file_cloth_image_canvas')
          }
          document.getElementById('cloth_label').style.display = 'none'
          setTimeout(() => {
            this.clothImg = document.getElementById('selected_file_cloth_image_canvas').toDataURL('image/png').replace(/^.*,/, '')
          }, 1000)
        }
      },
      generateTryOnImage(apiUrl) {
        if (this.poseImg === null || this.clothImg === null) {
          setTimeout(() => {
            this.loading = false
          }, 1000)
          return
        }
        var poseImgBase64 = this.poseImg
        var clothImgBase64 = this.clothImg
        try {
          axios.post(apiUrl, {
            'pose_img_base64': poseImgBase64,
            'cloth_img_base64': clothImgBase64
          })
            .then((res) => {
              let dataURL = `data:image/png;base64,${res.data.tryon_img_base64}`
              this.drawToCanvas(dataURL, 'tryon_image_canvas')
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
  .vton-diy
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
            .pose_panel_select, .cloth_panel_select
              position: relative
              width: 200px
              height: 264px
              line-height: 264px
              border: 4px lightblue solid
              #selected_file_pose_image, #selected_file_cloth_image
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
