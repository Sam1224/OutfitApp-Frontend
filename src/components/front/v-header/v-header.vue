<template>
  <div class="header">
    <el-page-header class="header-item" @back="goBack" :content="title" title="">
    </el-page-header>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'VHeader',
    props: {
      title: String
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .header-item
    position: relative
    top: 0
    width: 100%
    height: 60px
    z-index: 10
    color: #fff
    overflow: hidden
    background: dodgerblue
    .el-page-header__left
      .el-icon-back
        padding-left: 20px
    .el-page-header__content
      position: relative
      text-align: center
      line-height: 60px
      font-size: 24px
      color: white
</style>
