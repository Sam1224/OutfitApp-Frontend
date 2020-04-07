<template>
  <div class="virtual-try-on-wrapper">
    <div class="header-wrapper">
      <h1 class="text">{{title}}</h1>
    </div>
    <div class="vton" v-loading.fullscreen.lock="loading" element-loading-text="Generating..." element-loading-background="rgb(255, 255, 255)">
      <div class="steps-wrapper">
        <el-steps :active="active">
          <el-step v-for="(step, index) in stepData" :key="index" :title="step.title" :icon="step.icon" @click.native="changeStep(index)"></el-step>
        </el-steps>
      </div>
      <div class="views-wrapper">
        <el-row v-show="active === 0" class="step">
          <div class="image-wrapper">
            <div class="box_pose">
              <div class="box_pose_select">
                <label v-for="(pose, index) in poseData" :key="index" :for="getLabel('pose', index)" class="pose_panel_select" @click.prevent="selectPose(index)">
                  <input type="radio" class="select" :value="index + 1" :id="getLabel('pose', index)">
                  <img v-lazy="pose.url" :id="getImageLabel('pose', index)" style="border: 4px rgba(0, 0, 0, 0) solid">
                </label>
              </div>
              <!--
              <label for="pose_select_0" class="pose_panel_select" @click="selectPose(-1)">
                <input type="radio" value="0" id="pose_select_0">
                <input id="selected_file_pose_image" @change="changePose" type="file" accept="image/*">
                <canvas id="selected_file_pose_image_canvas" width="192" height="256"></canvas>
              </label>
               -->
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
              <div class="box_cloth_select">
                <label v-for="(cloth, index) in clothData" :key="index" :for="getLabel('cloth', index)" class="cloth_panel_select" @click.prevent="selectCloth(index)">
                  <input type="radio" class="select" :value="index + 1" :id="getLabel('cloth', index)">
                  <img :src="cloth.url" :id="getImageLabel('cloth', index)" style="border: 4px rgba(0, 0, 0, 0) solid">
                </label>
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

  export default {
    data () {
      return {
        title: 'Virtual Try-On',
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
        poseData: [{
          url: require('../../../../assets/sample_image/pose/000077_0.png')
        }, {
          url: require('../../../../assets/sample_image/pose/000123_0.png')
        }, {
          url: require('../../../../assets/sample_image/pose/000225_0.png')
        }, {
          url: require('../../../../assets/sample_image/pose/000163_0.png')
        }, {
          url: require('../../../../assets/sample_image/pose/000068_0.png')
        }],
        clothData: [{
          url: require('../../../../assets/sample_image/cloth/000011_1.png')
        }, {
          url: require('../../../../assets/sample_image/cloth/000051_1.png')
        }, {
          url: require('../../../../assets/sample_image/cloth/000145_1.png')
        }, {
          url: require('../../../../assets/sample_image/cloth/000256_1.png')
        }, {
          url: require('../../../../assets/sample_image/cloth/000840_1.png')
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
      selectPose(index) {
        for (let i = 0; i < 5; i++) {
          let pose = document.getElementById(this.getLabel('pose', i))
          pose.checked = false
          let image = document.getElementById(this.getImageLabel('pose', i))
          image.style.border = '4px rgba(0,0,0,0) solid'
        }
        let selectedPose = document.getElementById(this.getLabel('pose', index))
        selectedPose.checked = true
        let selectedImage = document.getElementById(this.getImageLabel('pose', index))
        selectedImage.style.border = '4px lightblue solid'

        this.poseImg = this.convImageToBase64(selectedImage, 'image/png').replace(/^.*,/, '')
      },
      selectCloth(index) {
        for (let i = 0; i < 5; i++) {
          let cloth = document.getElementById(this.getLabel('cloth', i))
          cloth.checked = false
          let image = document.getElementById(this.getImageLabel('cloth', i))
          image.style.border = '4px rgba(0,0,0,0) solid'
        }
        let selectedCloth = document.getElementById(this.getLabel('cloth', index))
        selectedCloth.checked = true
        let selectedImage = document.getElementById(this.getImageLabel('cloth', index))
        selectedImage.style.border = '4px lightblue solid'

        this.clothImg = this.convImageToBase64(selectedImage, 'image/png').replace(/^.*,/, '')
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
      changePose(e) {
        let it = this
        var reader = new FileReader()
        reader.readAsDataURL(e.target.files[0])
        reader.onload = function (e) {
          let imgSrc = e.target.result
          it.drawToCanvas(imgSrc, 'selected_file_pose_image_canvas')
          this.poseImg = document.getElementById('selected_file_pose_image_canvas').toDataURL('image/png').replace(/^.*,/, '')
        }
        let selectedImage = document.getElementById('selected_file_pose_image_canvas')
        selectedImage.style.border = '4px lightblue solid'
      },
      changeCloth(e) {
        let it = this
        var reader = new FileReader()
        reader.readAsDataURL(e.target.files[0])
        reader.onload = function (e) {
          let imgSrc = e.target.result
          it.drawToCanvas(imgSrc, 'selected_file_cloth_image_canvas')
          this.clothImg = document.getElementById('selected_file_cloth_image_canvas').toDataURL('image/png').replace(/^.*,/, '')
        }
        let selectedImage = document.getElementById('selected_file_pose_image_canvas')
        selectedImage.style.border = '4px lightblue solid'
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
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .header-wrapper
    position: relative
    top: 0
    width: 100%
    height: 60px
    z-index: 10
    color: #fff
    overflow: hidden
    background: dodgerblue
    .text
      position: relative
      text-align: center
      height: 20px
      line-height: 20px
      font-size: 24px
      margin: 24px
  .vton
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
