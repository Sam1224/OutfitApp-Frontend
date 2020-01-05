<template>
  <div class="home" v-loading.fullscreen.lock="loading" element-loading-text="Loading..." element-loading-background="rgb(255, 255, 255)">
    <div v-show="!loading" class="content-wrapper" ref="contentWrapper">
      <h1 class="vue-title">Welcome to the Backend of Custom Outfit App!</h1>
      <el-carousel :interval="3000" arrow="hover" class="slides" :height="sliderHeight +'px'">
        <el-carousel-item class="slide-item" v-for="(pic, index) in pics" :key="index">
          <el-image :src="pic" fit="fill"></el-image>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        loading: true,
        pics: [
          require('../../../assets/0.jpg'),
          require('../../../assets/1.jpg'),
          require('../../../assets/2.jpg'),
          require('../../../assets/3.jpg'),
          require('../../../assets/4.jpg'),
          require('../../../assets/5.jpg')
        ],
        sliderHeight: 1280
      }
    },
    created() {
      this._initializeData()
    },
    mounted() {
      this.setSlider()
      window.addEventListener('resize', () => {
        this.setSlider()
      }, false)
    },
    methods: {
      _initializeData() {
        setTimeout(() => {
          this.loading = false
        }, 1000)
      },
      setSlider() {
        this.sliderHeight = document.body.clientWidth * 9 * 0.6 / 16
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .home
    align-items: center
    justify-content: center
    text-align: center
    margin-top: 25px
    .content-wrapper
      text-align: center
      width: 60%
      margin: 0 auto
      .vue-title
        font-size: 40px
        margin-bottom: 25px
</style>
