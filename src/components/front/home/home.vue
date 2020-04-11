<template>
  <div class="home">
    <div v-show="!loading" class="content-wrapper">
      <div class="header-wrapper">
        <h1 class="text">{{title}}</h1>
      </div>
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
        title: 'Custom Outfit App',
        pics: [
          require('../../../assets/0.jpg'),
          require('../../../assets/1.jpg'),
          require('../../../assets/2.jpg'),
          require('../../../assets/3.jpg'),
          require('../../../assets/4.jpg')
        ],
        sliderHeight: 200
      }
    },
    created() {
      this._initializeData()
    },
    mounted() {
      this.setSliderHeight()
      window.addEventListener('resize', () => {
        this.setSliderHeight()
      }, false)
    },
    methods: {
      _initializeData() {
        setTimeout(() => {
          this.loading = false
        }, 1000)
      },
      setSliderHeight() {
        this.sliderHeight = document.body.clientWidth * 9 / 16
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .home
    align-items: center
    justify-content: center
    text-align: center
    .content-wrapper
      text-align: center
      width: 100%
      height: 100%
      margin: 0 auto
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
</style>
