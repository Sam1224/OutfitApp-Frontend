<template>
  <div class="header-wrapper">
    <h1 class="text">{{title}}</h1>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: String
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
</style>
