<template>
  <div class="index-wrapper">
    <router-view></router-view>
    <div class="footer-wrapper">
      <v-footer></v-footer>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import VFooter from '@/components/front/v-footer/v-footer'

  export default {
    components: {
      VFooter
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .index-wrapper
    text-align: left
    .footer-wrapper
      position: fixed
      left: 0
      bottom: -1px
      width: 100%
      box-shadow: 0 0 10px 0 hsla(0, 6%, 58%, 0.6)
      height: 50px
      z-index: 999
      background: lightgreen
</style>
