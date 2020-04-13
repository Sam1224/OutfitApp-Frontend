<template>
  <div class="home">
    <div class="header-wrapper">
      <h1 class="text">{{title}}</h1>
    </div>
    <div v-show="!loading" class="content-wrapper">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>Virtual Try-On Samples</span>
        </div>
        <el-carousel :interval="3000" arrow="hover" class="slides" height="166px">
          <el-carousel-item class="slide-item" v-for="(pic, index) in vtonPics" :key="index">
            <el-image :src="pic" fit="fill"></el-image>
          </el-carousel-item>
        </el-carousel>
      </el-card>
      <el-card class="box-card" shadow="never" style="padding-bottom: 50px">
        <div slot="header" class="clearfix">
          <span>Outfits Retrieval Samples</span>
        </div>
        <el-carousel :interval="3000" arrow="hover" class="slides" height="331px">
          <el-carousel-item class="slide-item" v-for="(pic, index) in retrievalPics" :key="index">
            <el-image :src="pic" fit="fill"></el-image>
          </el-carousel-item>
        </el-carousel>
      </el-card>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        loading: true,
        title: 'Custom Outfit App',
        vtonPics: [
          require('../../../assets/vton-0.jpg'),
          require('../../../assets/vton-1.jpg'),
          require('../../../assets/vton-2.jpg'),
          require('../../../assets/vton-3.jpg')
        ],
        retrievalPics: [
          require('../../../assets/retrieval-0.jpg'),
          require('../../../assets/retrieval-1.jpg'),
          require('../../../assets/retrieval-2.jpg'),
          require('../../../assets/retrieval-3.jpg')
        ],
        sliderHeight: 512
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
        this.sliderHeight = document.body.clientWidth / 2
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .home
    align-items: center
    justify-content: center
    text-align: center
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
    .content-wrapper
      text-align: center
      width: 100%
      height: 100%
      margin: 0 auto
      .box-card
        width: 100%
        .clearfix
          position: relative
          &::after
            display: table
            content: ""
            clear: both
        .slides
          background: rgba(0, 0, 0, 0.1)
</style>
