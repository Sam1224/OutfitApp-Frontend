<template>
  <div class="footer">
    <router-link class="footer-item" to="/home">
      <i class="iconfont el-icon-s-home"></i>
    </router-link>
    <router-link class="footer-item" to="/vton">
      <i class="iconfont el-icon-s-goods"></i>
    </router-link>
    <router-link class="footer-item" to="/retrieval">
      <i class="iconfont el-icon-s-goods"></i>
    </router-link>
    <router-link class="footer-item" to="/personal">
      <i class="iconfont el-icon-s-custom"></i>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'VFooter'
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .footer
    display: flex
    width: 100%
    height: 50px
    background: #fff
    .footer-item
      flex: 1
      display: flex
      justify-content: center
      align-items: center
      flex-direction: column
      color: #333
      font-size: 12px
      .iconfont
        margin-bottom: 4px
        font-size: 18px
      &.active
        color: dodgerblue
</style>
